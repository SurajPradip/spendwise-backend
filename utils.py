from pymongo import MongoClient

def get_db_handle(name,host,port,username,password):
    client = MongoClient(host=host,
                         port = int(port),
                         username=username,
                         password=password)
    
    # connection_string = "mongodb+srv://surajpradipoff:nOBvqv6QbmZMFpfi@cluster0.i3kzzgb.mongodb.net/"
    # client = MongoClient(connection_string)
    
    db_handle = client['name']
    
   
    return db_handle,client