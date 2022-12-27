from os.path import dirname, abspath
from pymongo import MongoClient
from dotenv import load_dotenv
from bson.objectid import ObjectId
import os
import datetime


# create my class to represent an Operation manager of Space collection

class Group:
    def __init__(self,User=""):
        self.User = User
        # config connexion to mongodb collection :
        path = '../../.env'
        load_dotenv(path)
        connexion_url = os.getenv('DB_URL')
        # get connexion with atlas mongodb :
        my_client = MongoClient(connexion_url)
        self.my_collection = my_client.Flask_Cloud.SharedSpace
    # define menmbre methods :
    def getAllSpaces(self):
        # try to get all spaces that user joind or create : 
        try:
            all_spaces = list(
                self.my_collection.find(
                    {}
                    ,{
                        '_id':0
                    }
                )
            )
            # filter result :
            filtred_result = [] 
            for space in all_spaces:
                if space['Creator'] == self.User or self.User in list(space['Member']):
                    filtred_result.append(space)
            return filtred_result
        except Exception as e:
            print(" [ error get All spaces ] : "+str(e))
            return []
    def getMembers(self,SpaceName=""):
        try:
            return list(
                self.my_collection.find(
                    {
                        # filter :
                        'Creator':self.User,
                        'Name':SpaceName
                    },
                    {
                        '_id':0
                    }
                )
            )[0]['Member']
        except Exception as e:
            print("[ get Space Membre Error ] : "+str(e))
            return []
    def getContent(self,SpaceName=""):
        try:
            return list(
                self.my_collection.find(
                    {
                    # filter :
                    'Creator': self.User,
                    'Name': SpaceName
                    },{
                        '_id':0
                    }
                )
            )[0]['Content']
        except Exception as e:
            print(" [ fetch Space content error ] : "+str(e))
            return []
    
