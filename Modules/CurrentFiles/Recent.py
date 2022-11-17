from pymongo import MongoClient
from dotenv import load_dotenv
from bson.objectid import ObjectId
from  datetime import datetime, timedelta 

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



