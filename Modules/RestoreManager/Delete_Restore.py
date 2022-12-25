from pymongo import MongoClient
from dotenv import load_dotenv
from bson.objectid import ObjectId
from Modules.Folder.FolderManager import Folder
import os
import datetime

class DataRestoreManager:
    '''
    class take current user connected, upload_folder_base 
    as argument 
    this class manage the DeletedFiles mongodb Collections
    collection take this schema as document structur :
    {
        "_id": {
            "$oid": "6399ef3c754eda6264b3bfac"
    },
    "Name": "cv_image.png",
    "Type": "File",
    "Date": "2022-12-13",
    "User": "chopen",
    "Url": "UploadStore/cv_image.png",
    "DeletedDate": "2022-12-13"
    }
    '''
    def __init__(self,upload_path="",User=""):
        self.path_base = upload_path
        self.User = User
        self.DeleteStore = "/DeleteStore"
    def connect_to_mongoDb(self):
        env_path = "../../.env"
        load_dotenv(env_path)
        self.connxion_uri = os.getenv('DB_URL')
        self.my_collection = MongoClient(
            self.connxion_uri).Flask_Cloud.DeletedFiles
        return
    def addToTrush(self,file_target={},folder_target=""):
        # make connexion to mongodb database :
        self.connect_to_mongoDb()
        try:
            self.my_collection.insert_one(
                {
                    "Name":file_target['Name'],
                    "Type": file_target['Type'],
                    "Date": file_target['Date'],
                    "User":self.User,
                    "Url":file_target['Url'],
                    "Vrl":folder_target+"/"+file_target['Name'],
                    "DeletedDate": str(datetime.datetime.now()).split(" ")[0]
                }
            )
        except Exception as e:
            print("[ New DeletedFile Error ] : "+str(e))
        return
    # method that delet finally the physical file from deletedStore :
    def RemoveFile(self,file_target_name=""):
        # step 1: make connection to the mongodb database : 
        self.connect_to_mongoDb()
        # step 2 : get the file object from collection by name :
        try:
            file_target = list(
                self.my_collection.find(
                    {
                        'Name':file_target_name,
                        'User':self.User
                    },{
                        '_id':0
                    }
                    )
            )[0]
            # step 3 : delete phy-file from DeleteStore :
            file_path = os.path.join("././DeleteStore",file_target['Name'])
            #print(" Delet :   \n"+str(file_path))
            os.remove(file_path)
            # step 4 : delete the file document from the collection :
            self.my_collection.delete_one({
                'Name': file_target_name,
                'User': self.User
            })
            return 1
        except Exception as e:
            print(" [get deleted-file error ] : "+str(e))
            return -1
    def RestoreFile(self,file_target_name=""):
        # step 1 : get the file target :
        self.connect_to_mongoDb()
        try:
            target_file = list(
                self.my_collection.find(
                {
                    'Name':file_target_name,
                    'User':self.User
                },
                {
                    '_id':0
                }
            ))[0]
            # step 2 : create the folder-image if not exist form file['Vrl']
            # sub-step 1 : get the folder name from the Vrl file attribute :
            folder_t_create = target_file['Vrl'].split('/')[0]
            # sub-step 2: check if there is the folder already exit ( it sould be not):
            my_folder_manager = Folder()
            my_folder_manager.connect()
            my_folder_form = {
                'Name':folder_t_create,
                "Owner":self.User
            }
            # step 3 : creta new folder.content object to reference current restored file
            # sub step : check if the folder image already exist :
            list_folders = my_folder_manager.getAllFolders(username=self.User)
            response_check = 0
            for f_item in list_folders:
                if f_item['Name'] == folder_t_create:
                    response_check = 1
                    break
            if response_check == 0:
                respose_insert_folder = my_folder_manager.insertFolder(
                    folderdata=my_folder_form)
                # step 4 : copy physical-file from deletedStore to UploadedStore
                if respose_insert_folder == 1:
                    update_content_response = my_folder_manager.RestoreFolderContent(
                        foldername=folder_t_create
                        ,fileData=target_file
                    )
                    if update_content_response == 1:
                        # step 5 :delete file document from deleted_files colletion:
                        self.my_collection.delete_one({
                            'Name': file_target_name,
                            'User': self.User
                        })
                    return 1
            else:
                # folder already created :
                update_content_response = my_folder_manager.RestoreFolderContent(
                    foldername=folder_t_create, fileData=target_file
                )
                if update_content_response == 1:
                    # step 5 :delete file document from deleted_files colletion:
                    self.my_collection.delete_one({
                        'Name': file_target_name,
                        'User': self.User
                    })
                    return 1
        except Exception as e:
            print(" [ find file to restore error ] : "+str(e))
            return -1
        return
    def getAll(self):
        self.connect_to_mongoDb()
        try:
            return list(
                self.my_collection.find({
                    "User":self.User
                },
                {
                    '_id':0
                })
                )
        except Exception as e:
            print(" [ fetch All deleted error ] : "+str(e))
            return []