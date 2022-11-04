from os.path import dirname, abspath
from pymongo import MongoClient
from dotenv import load_dotenv
from bson.objectid import ObjectId
import os
import datetime

# define an folder class :
 
class Folder:
    def __init__(self,formdata={}):
        self.Name = ''  #formdata['Name']''
        self.Owner = '' #formdata['Owner']
        self.CreateAt = "" #formdata['CreateAt']
        self.Size = "" #formdata['Size']
        self.Content = ""  # formdata['Content']
        self.LastUpdate = ""  # formdata['LastUpdate']
    def connect(self):
        path = '../../.env'
        load_dotenv(path)
        self.connexion_url = os.getenv('DB_URL')
        # get connexion with atlas mongodb :
        self.my_client = MongoClient(self.connexion_url)
        self.my_db = self.my_client.Flask_Cloud
        return
    def getOwner(self):
        return self.Owner
    def getData(self,username=""):
        folderData = list(
            self.my_db.Folders.find(
                {# filter 
                    'Owner':username
                },
            )
        )[0]
        return folderData
    def getFolder(self,username="",foldername=""):
        # check if already exist an folder with the same name : 
        fetch_result = list(
            self.my_db.Folders.find(
                {
                    'Name':foldername,
                    'Owner':username
                }
            )
        )
        if len(fetch_result) != 0:
            return fetch_result[0]
        return {}
    def insertFolder(self,folderdata):
        response = 0
        date = str(datetime.datetime.now()).split(" ")[0]
        try:
            self.my_db.Folders.insert_one({
                    "Name": folderdata['Name'],
                    "CreateAt": date,
                    "Size": 0,
                    "Owner": folderdata['Owner'],
                    "Content": [],
                    "LastUpdate": date
            })
            response =  1
        except Exception as e:
            print("[ insert folder error ]: "+str(e))
            response =  - 1
        return response

    def getAllFolders(self,username=""):
        # get list of folders :
        folders = list(
            self.my_db.Folders.find(
                {
                    'Owner': username
                },
                {
                    '_id':0
                }
            )
        )
        return folders
    def delete(self,foldername=""):
        # get connexion :
        # for now delete functon delete the real folder and his content 
        # later i will be manage an Corbeille function 
        try:
            self.my_db.Folders.delete_one({
                'Name':foldername
            })
            return 1
        except Exception as e:
            print(" [ Delete Folder Error ] : "+str(e))
            return -1
    def AddContent(self,foldername="",fileData={}):
        # create an contene object :
        print("\n Cuurent file Name :   ",str(fileData.filename))
        my_content = {
            'Name':fileData.filename.split('/')[1],
            'Type':'File',
            'Date': str(datetime.datetime.now()).split(" ")[0]
        }
        print("contenet to add ",my_content)
        try:
            #get connexion to mongo db 
            self.my_db.Folders.update_one(
                {'Name': foldername}, {'$addToSet': {'Content': my_content}})
            return 1
        except Exception as e:
            print("[ Push Content Error ] : "+str(e))
            return -1
    def updateDate(self,foldername=""):
        try:
            #get connexion to mongo db
            self.my_db.Folders.update_one(
                {'Name': foldername}, {'$set': {'LastUpdate': str(datetime.datetime.now()).split(" ")[0]}})
            return 1
        except Exception as e:
            print("[ Update Date  Error ] : "+str(e))
            return -1
