from os.path import dirname, abspath
from pymongo import MongoClient
from dotenv import load_dotenv
from bson.objectid import ObjectId
import os
import datetime



# create new class : 

class UFolder:
    def __init__(self,foldername=""):
        self.foldername = foldername
    def connect(self):
        path = '../../.env'
        load_dotenv(path)
        self.connexion_url = os.getenv('DB_URL')
        # get connexion with atlas mongodb :
        self.my_client = MongoClient(self.connexion_url)
        self.my_db = self.my_client.Flask_Cloud
        return

    def getFolder(self, username="", foldername=""):
        # check if already exist an folder with the same name :
        fetch_result = list(
            self.my_db.Folders.find(
                {
                    'Name': foldername,
                    'Owner': username
                }
            )
        )
        if len(fetch_result) != 0:
            return fetch_result[0]
        return {}
