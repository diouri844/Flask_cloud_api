from pymongo import MongoClient
from dotenv import load_dotenv
from bson.objectid import ObjectId
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
    def connect_to_mongoDb(self):
        env_path = "../../.env"
        load_dotenv(env_path)
        self.connxion_uri = os.getenv('DB_URL')
        self.my_collection = MongoClient(
            self.connxion_uri).Flask_Cloud.DeletedFiles
        return
    def addToTrush(self,file_target={}):
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
                    "DeletedDate": str(datetime.datetime.now()).split(" ")[0]
                }
            )
        except Exception as e:
            print("[ New DeletedFile Error ] : "+str(e))
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