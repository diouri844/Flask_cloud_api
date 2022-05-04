import sqlite3

def create_user(username,email,password,fname,lname,phone,date_s,date_l,type_account):
    try:
        connexion = sqlite3.connect("../DBA_config/DBA_Temp.db")
        cursor = connexion.cursor()
        command = "INSERT INTO User VALUES (Null,'"+str(username)+"','"+str(email)+"','"+str(password)+"','"+str(fname)+"','"+str(lastname)+"','"+str(phone)+"','"+str(date_s)+"','"+str(date_s)+"','"+str(type_account)+"')"
        command = cursor.execute(command)
        connexion.commit()
    except Exception as e:
        print("[User create error ]: "+str(e))
        connexion.rollback()
    finally:
        cursor.close()
        connexion.close()
    return

def get_user_by_id(user_key):
    #user key => user_name or user_email or user_phone:
    return

def check_user_account(username,email,phone):
    # check if user_name or user_email or user_phone already exist :
    try:
        with sqlite3.connect("../DBA_config/DBA_Temp.db") as connexion:
            with connexion.cursor() as cursor:
                command = "SELECT count(*) FROM User WHERE User.Name='"+str(username)+"' or User.Email='"+str(email)+"' or User.Phone='"+str(phone)+"'"
                command = cursor.execute(command)
                result = command.fetchall()[0]
                if result == 0:
                    return True
                else:
                    return False
    except Exception as e:
        print("[fetch user error ]: "+str(e))        