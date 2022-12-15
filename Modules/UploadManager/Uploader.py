from pymongo import MongoClient
from dotenv import load_dotenv
from bson.objectid import ObjectId
import shutil,os
from Modules.Folder.FolderManager import Folder


# create my upload server manager class :

class UploadManager:
    def __init__(self, uploadPath="",User=""):
        parent = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
        self.dirname = os.path.join(parent, uploadPath)
        # get the owner folder list from Folder class :
        self.CurrentFolder = Folder()
        self.CurrentFolder.connect()
        self.StoreOwner = User
        # initialize a file list as a empty list :
        self.StoredFiles = []

    def getFolderFiles(self, foldername=""):
        return self.CurrentFolder.getFolder(self.StoreOwner, foldername)['Content']
    
    def getFullFilePath(self, foldername=""):
        my_file_path = []
        for obj_file in self.getFolderFiles(foldername):
            my_file_path.append(os.path.join(self.dirname,obj_file['Name']))
        return my_file_path

    def deleteFolderFiles(self, foldername=""):
        # delete each file from the server upload store : UploadStore\bacalaure.png
        list_path = self.getFullFilePath(foldername)
        counter = len(list_path)
        for file_path in list_path:
            try:
                print(" Delet :   \n"+str(file_path))
                os.remove(file_path)
                counter -= 1
            except Exception as e:
                print(" [ Delete File Error ] :  "+str(e))
        # check if the counter is 0: 
        if counter == 0:
            return 1
        return -1
    def replaceFolderFiles(self, foldername=""):
        # replace each file from the server upload store : UploadStore\bacalaure.png
        list_path = self.getFullFilePath(foldername)
        counter = len(list_path)
        for file_path in list_path:
            try:
                print(" Replace :   \n"+str(file_path))
                """
                try to replace file to DeletedStore Folder :
                """
                shutil.copy(file_path, 'DeleteStore')
                os.remove(file_path)
                counter -= 1
            except Exception as e:
                print(" [ Delete File Error ] :  "+str(e))
        # check if the counter is 0:
        if counter == 0:
            return 1
        return -1
