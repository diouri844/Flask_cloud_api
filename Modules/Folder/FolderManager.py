from os.path import dirname, abspath
from pymongo import MongoClient
from dotenv import load_dotenv
from bson.objectid import ObjectId
import os

# define an folder class :
 
class Folder:
    def __init__(self,formdata={}):
        self.Name = formdata['Name']
        self.Owner = formdata['Owner']
        self.CreateAt = formdata['CreateAt']
        self.Size = formdata['Size']
        self.Content = formdata['Content']
        self.LastUpdate = formdata['LastUpdate']
    def connect(self):
        path = dirname(abspath(__file__)) + '/.env'
        load_dotenv(path)
        self.connexion_url = os.getenv('DB_URL')
        # get connexion with atlas mongodb :
        self.my_client = MongoClient(self.connexion_url)
        self.my_db = self.my_client.Flask_Cloud
        return
    def getData(self,username=""):
        folderData = list(
            self.my_db.Folders.find(
                {# filter 
                    'Owner':username
                },
            )
        )[0]
        return folderData

