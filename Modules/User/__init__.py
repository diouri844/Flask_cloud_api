import sqlite3

# step  1: create user account 
def account_setup(user_name, user_email, user_pswd):
    response = 0
    try:
        connexion = sqlite3.connect("Modules\DBA_config\DBA_Temp.db")
        cursor = connexion.cursor()
        command = "INSERT INTO User_account VALUES (Null,'"+str(user_name)+"','"+str(user_email)+"','"+str(user_pswd)+"')"
        command = cursor.execute(command)
        connexion.commit()
        response = 1
    except Exception as e:
        print("[User_account create error ]: "+str(e))
        connexion.rollback()
        response = -1
    finally:
        cursor.close()
        connexion.close()
    return response
# setep 2 : add user details

def set_account_details(fname,lname,phone,date_l,id,type_account):
    response = 0
    try:
        connexion = sqlite3.connect("Modules\DBA_config\DBA_Temp.db")
        cursor = connexion.cursor()
        command = "INSERT INTO User_details (Id,FerstName,LastNAme,Phone,DateSingup,UserType,UserId) VALUES (Null,'"+str(
            fname)+"','"+str(lname)+"','"+str(phone)+"','"+str(date_l)+"','"+str(type_account)+"',"+str(id)+")"
        command = cursor.execute(command)
        connexion.commit()
        response = 1
    except Exception as e:
        print("[User_details create error ]: "+str(e))
        connexion.rollback()
        response = -1
    finally:
        cursor.close()
        connexion.close()
    return response


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


def set_payment_details(name, number,date, pswd, user_id):
    response = 0
    try:
        connexion = sqlite3.connect("Modules\DBA_config\DBA_Temp.db")
        cursor = connexion.cursor()
        command = "INSERT INTO Payment_details VALUES (Null,'"+str(name)+"','"+str(number)+"','"+str(date)+"','"+str(pswd)+"',"+str(user_id)+")"
        command = cursor.execute(command)
        connexion.commit()
        response = 1
    except Exception as e:
        print("[User_details create error ]: "+str(e))
        connexion.rollback()
        response = -1
    finally:
        cursor.close()
        connexion.close()
    return response



def get_user_id_by_username(user_name):
    try:
        connexion = sqlite3.connect("Modules\DBA_config\DBA_Temp.db")
        cursor = connexion.cursor()
        command = "SELECT Id FROM User_account WHERE Name='"+str(user_name)+"'"
        command = cursor.execute(command)
        id_result = command.fetchall()[0][0]
    except Exception as e:
        print("[error fetch user-id by name-key ] :  "+str(e))
        id_result = -1
    finally:
        cursor.close()
        connexion.close()
    return id_result


def get_personal_details_by_id(user_id):
    try:
        connexion = sqlite3.connect("Modules\DBA_config\DBA_Temp.db")
        cursor = connexion.cursor()
        command = "SELECT Id FROM User_details WHERE UserId="+str(user_id)+""
        command = cursor.execute(command)
        id_dtails = command.fetchall()[0][0]
    except Exception as e:
        print("[error fetch details-id by id-key ] :  "+str(e))
        id_dtails = -1
    finally:
        cursor.close()
        connexion.close()
    return id_dtails


def get_user_by_id(user_id):
    #user key => user_name or user_email or user_phone:
    try:
        connexion = sqlite3.connect("Modules\DBA_config\DBA_Temp.db")
        cursor = connexion.cursor()
        command = "SELECT * FROM User_account WHERE User_account.id=" + \
            str(user_id)
        command = cursor.execute(command)
        resultat = command.fetchall()[0]
    except  Exception as e:
        print("[error fetch user by key ] :  "+str(e))
        resultat = []
    finally:
        cursor.close()
        connexion.close()
    return resultat

def check_user_account(username,email):
    # check if user_name or user_email or user_phone already exist :
    try:
        connexion = sqlite3.connect("Modules\DBA_config\DBA_Temp.db")
        cursor = connexion.cursor()
        command = "SELECT count(*) FROM User_account WHERE User_account.Name='" + \
            str(username)+"' or User_account.Email='"+str(email)+"'"
        command = cursor.execute(command)
        result = command.fetchall()[0]
        print("[fetch user result ] : "+str(result))
        if result[0] == 0:
            return False
    except Exception as e:
        print("[fetch user error ]: "+str(e))       
    return True