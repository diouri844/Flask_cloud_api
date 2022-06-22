import sqlite3

def create_user(username,email,password,fname,lname,phone,date_s,date_l,type_account):
    message = ""
    try:
        connexion = sqlite3.connect("Modules\DBA_config\DBA_Temp.db")
        cursor = connexion.cursor()
        command = "INSERT INTO User VALUES (Null,'"+str(username)+"','"+str(email)+"','"+str(password)+"','"+str(fname)+"','"+str(lname)+"','"+str(phone)+"','"+str(date_s)+"','"+str(date_s)+"','"+str(type_account)+"')"
        command = cursor.execute(command)
        connexion.commit()
        message = "New account created successfully :)"
    except Exception as e:
        print("[User create error ]: "+str(e))
        connexion.rollback()
        message = "Create new account is failed" 
    finally:
        cursor.close()
        connexion.close()
    return message

def add_credit_card_info(user_id,card_name,card_number,card_date,card_cvc):
    try:
        connexion = sqlite3.connect("Modules\DBA_config\DBA_Temp.db")
        cursor = connexion.cursor()
        command = "INSERT INTO Payment VALUES (Null,'"+str(card_name)+"','"+str(card_number)+"','"+str(card_date)+"','"+str(card_cvc)+"',"+str(user_id)+")"
        command = cursor.execute(command)
        connexion.commit()
        message = "Update account card info successfully"
    except Exception as e:
        print("[User create error ]: "+str(e))
        message = "Update account card info failed"
        connexion.rollback()
    finally:
        cursor.close()
        connexion.close()
    return message

def get_user_id_by_phone(user_phone):
    try:
        connexion = sqlite3.connect("Modules\DBA_config\DBA_Temp.db")
        cursor = connexion.cursor()
        command = "SELECT User.id FROM User WHERE User.Phone="+str(user_phone)
        command = cursor.execute(command)
        id_result = command.fetchall()
    except Exception as e:
        print("[error fetch user-id by phone-key ] :  "+str(e))
        id_result = -1
    finally:
        cursor.close()
        connexion.close()
    return id_result





def get_user_by_id(user_id):
    #user key => user_name or user_email or user_phone:
    try:
        connexion = sqlite3.connect("Modules\DBA_config\DBA_Temp.db")
        cursor = connexion.cursor()
        command = "SELECT * FROM User WHERE User.id="+str(user_id)
        command = cursor.execute(command)
        resultat = command.fetchall()[0]
    except  Exception as e:
        print("[error fetch user by key ] :  "+str(e))
        resultat = []
    finally:
        cursor.close()
        connexion.close()
    return resultat

def check_user_account(username,email,phone):
    # check if user_name or user_email or user_phone already exist :
    try:
        connexion = sqlite3.connect("Modules\DBA_config\DBA_Temp.db")
        cursor = connexion.cursor()
        command = "SELECT count(*) FROM User WHERE User.Name='"+str(username)+"' or User.Email='"+str(email)+"' or User.Phone='"+str(phone)+"'"
        command = cursor.execute(command)
        result = command.fetchall()[0]
        print("[fetch user result ] : "+str(result))
        if result[0] == 0:
            return False
    except Exception as e:
        print("[fetch user error ]: "+str(e))       
    return True