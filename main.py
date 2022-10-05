from flask import Flask, render_template, request, redirect, url_for, flash, session,jsonify
from Modules.User import *
from Modules.Folder.FolderManager import Folder

my_app = Flask(__name__)
# home page :   
@my_app.route('/')
def home():
    # home function body :
    return render_template('Home.html')
#create account link controler :
@my_app.route('/singup/<subject>',methods=['POST'])
def singup_controler(subject):
    if request.method == 'POST':
        index_subject = ['Account_setup',"Personal_data","Payment_details"]
        response_message = ""
        response_state = ""
        if subject == index_subject[0]:
            user_data = request.form.to_dict()
            user_name = user_data['name']
            user_email = user_data['Email']
            user_pswd = user_data['Password']
            #check user account :
            if check_user_account(user_name, user_email) == True:
                response_message = "Account already exist "
                response_state = "danger"
            else:
                response_account_setup = account_setup(user_name,user_email,user_pswd)
                if response_account_setup == 1:
                    response_message = "You have successfully set up your account."
                    response_state = "success"
                else:
                    response_message = "Failed to set up your account, try again."
                    response_state = "danger"
        if subject == index_subject[1]:
            user_data = request.form.to_dict()
            user_fname = user_data['ferstname']
            user_lname = user_data['lastname']
            user_phone = user_data['phonenumber']
            user_date_join = user_data['date']
            user_name = user_data['name']
            user_account_type = user_data['state_account']
            user_id = get_user_id_by_username(user_name)
            reponse_user_details = set_account_details(user_fname,user_lname,user_phone,user_date_join,user_id,user_account_type)
            if reponse_user_details == 1:
                response_message = "You have succeeded in configuring your personal information."
                response_state = "success"
            else:
                response_message = "Failed to configure your personal data, retry."
                response_state = "danger"
        if subject == index_subject[2]:
            credit_card_info = request.form.to_dict()
            card_name = credit_card_info['CreditCardName']
            card_number = credit_card_info['CreditCardNumber']
            card_date = credit_card_info['CreditCardDate']
            card_pswd = credit_card_info['CreditCardPassword']
            user_name = credit_card_info['name']
            user_id = get_user_id_by_username(user_name)
            #details_id = get_personal_details_by_id(user_id)
            response_payment_details = set_payment_details(card_name, card_number,
                                                            card_date, card_pswd, user_id)
            if response_payment_details == 1:
                response_message = "Congratulations, your account has been created."
                response_state = "success"
            else:
                response_message = "Failed to complete payment details, please try again."
                response_state = "danger"
        return jsonify({'message': response_message, 'state': response_state})

@my_app.route('/singin',methods=['POST'])
def singin_controler():
    if request.method == 'POST':
        response_message = ""
        response_state = ""
        user_data = request.form.to_dict()
        user_name = user_data['UserName']
        user_email = user_data['UserEmail']
        user_pswd = user_data['UserPassword']
        url_redirect = ""
        if check_user_account(user_name, user_email) == True:
            #account existe 
            # step 2 : check password :
            user_id =  get_user_id_by_username(user_name)
            user_pswd_index = get_user_by_id(user_id)[3]
            if user_pswd == user_pswd_index:
                response_message = "Welcome back "+str(user_name)
                response_state = "success"
                session['id'] = user_id
                session['User'] = get_user_by_id(user_id)
                user_folder = Folder()
                user_folder.connect()
                session['Folders'] = user_folder.getAllFolders(user_name)
                print("User Connected Folder list is :    ",session['Folders'])
                url_redirect = "Dashbroad/"+str(user_name)
            else:
                response_message = "Invalid username or e-mail address/password retry."
                response_state = "danger"
        return jsonify({'message': response_message, 'state': response_state , 'url':url_redirect})


@my_app.route("/Folder",methods=['POST','GET'])
def FolderHandler():
    if request.method == 'POST':
        response_message = ""
        response_state = ""
        data = request.form.to_dict()
        folder = Folder()
        folder.connect()
        find_folder = folder.getFolder(session['User'][1],data['FolderName'])
        if len(find_folder)!=0:
            response_message = " Folder Already exist "
            response_state = "error"
        else:
            data_to_insert = {
                'Name':data['FolderName'],
                'Owner':session['User'][1]
            }
            response_insert_folder = folder.insertFolder(data_to_insert)
            if response_insert_folder == 1:
                response_message = str(data['FolderName'])+" Created succuefly "
                user_folder = Folder()
                user_folder.connect()
                session['Folders'] = user_folder.getAllFolders(session['User'][1])
            else:
                response_message = "Failed to create folder, try later."
            response_state = "succus"
        return jsonify({'message': response_message, 'state': response_state})
    if request.method == "GET":
        user_name = session['User'][1]
        folder = Folder()
        folder.connect()
        data = folder.getAllFolders(user_name)
        return jsonify({'Folders':data})


@my_app.route("/Dashbroad/<user_name>")
def get_home(user_name):
    if 'User' in session:
        return render_template("Dashbroad.html",User=session['User'])
    else:
        return render_template("Error_Handler.html",user=user_name)


@my_app.route("/Profile")
def get_User_Profile():
    if request.method == 'GET':
        #check if already session is opened : 
        response_state = 501
        response_data = {}
        if 'User' in session:
            response_state = 200
            response_data = session['User']
        return jsonify({'state': response_state, 'data':response_data})

if __name__ == '__main__':
    my_app.secret_key = 'super secret key'
    my_app.config['SESSION_TYPE'] = 'filesystem'
    my_app.run(debug=True)