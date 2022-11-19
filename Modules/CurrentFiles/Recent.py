from pymongo import MongoClient
from dotenv import load_dotenv
from bson.objectid import ObjectId
from  datetime import datetime, timedelta 
import os
#define my Current Uploded Files class  :

class CurrentUploaded:
    def __init__(self,UserName=""):
        # setup :
        self.User = UserName
        # make connexion to the database (mongodb )
        path = '../../.env'
        load_dotenv(path)
        self.connexion_url = os.getenv('DB_URL')
        # get connexion with atlas mongodb :
        self.my_client = MongoClient(self.connexion_url)
        self.my_collection = self.my_client.Flask_Cloud.RecentUploaded
    def addFile(self,formdata={}):
        # form data schema as : 
        #{
        #"_id": {
        #"$oid": "637696334b83388313cb6fde"
        #},
        #"Name": "test.txt",
        #"Type": "File",
        #"User": "connected User",
        #"OperationDate": "current-date",
        #"DeletedDate": "OperationDate+1"
        #}
        operatig_date = datetime.now()
        # define deleted time after 24 hours :
        deleting_date = operatig_date + timedelta(days=1)
        try:
            self.my_collection.insert_one({
                "Name":formdata['Name'],
                "Type":"File",
                "User":self.User,
                "OperationDate": str(operatig_date).split(" ")[0],
                "DeletedDate": str(deleting_date).split(" ")[0]
            })
        except Exception as e:
            print(" [ Update Recent files error ] : "+str(e))
        return
    def delete_date(self):
        # check if the deleted day is the current day :
        current_date = str(datetime.now()).split(" ")[0]
        # filter by user name and  deleted ddate : 
        try:
            self.my_collection.delete_many({
                #filter :
                "User":self.User,
                "DeletedDate":current_date
            })
        except Exception as e:
            print(" [ Error delete recent ] :  "+str(e))
        return
    def get(self):
        # try make connexion : 
        try:
            return list(self.my_collection.find(
                {'User':self.User},
                {"_id": 0}
            ))
        except Exception as e:
            print(" [ error get files ] : "+str(e))
            return []
    def remove_item(self,item_name):
        try:
            self.my_collection.delete_one({'Name':item_name,'User':self.User})
        except Exception as e:
            print("[ force delete error ] :  "+str(e))
        return 