from flask import Flask, render_template, request, redirect, url_for, flash, session,jsonify
from Modules.User import *
from Modules.Folder.FolderManager import Folder
from Modules.UploadManager.Uploader import UploadManager
from Modules.CurrentFiles.Recent import CurrentUploaded
from Modules.RestoreManager.Delete_Restore import DataRestoreManager
from werkzeug.utils import secure_filename

my_app = Flask(__name__)
UploadFolder = "UploadStore"
my_app.config['UPLOAD_FOLDER'] = UploadFolder+"/"
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

@my_app.route("/Folder/<foldername>",methods=['GET'])
def FolderMAnager(foldername):
    if request.method == 'GET':
        response_message = ""
        response_state = ""
        folder_handler = Folder()
        folder_handler.connect()
        # create my current file manager instance :
        my_current_manager = CurrentUploaded(session['User'][1])
        # create a upload manager instance : 
        my_manager = UploadManager(UploadFolder,session['User'][1])
        # get filename list of the target folder : 
        content_files= folder_handler.getFolder(session['User'][1],foldername)['Content']
        # create delet restore manager :
        delet_manager = DataRestoreManager(UploadFolder, session['User'][1])
        for content_item in content_files:
            '''
            for each content_item deleted , add it as an new
            document  
            '''
            delet_manager.addToTrush(content_item)
            my_current_manager.remove_item(content_item['Name'])
        # delete the files from upload folder : 
        delete_files_response = my_manager.replaceFolderFiles((foldername))
        # delete the v-folder user :
        response_delete_folder = folder_handler.delete(foldername)
        if delete_files_response == 1 and response_delete_folder == 1:
            response_message = "You have succeeded in removing your folder and its files."
            response_state = "custom"
    return jsonify({"message":response_message,"state":response_state})




@my_app.route("/Dashbroad/<user_name>")
def get_home(user_name):
    if 'User' in session:
        # check all recent files : 
        my_current_manager = CurrentUploaded(session['User'][1])
        # delete all files should be deleted : 
        my_current_manager.delete_date()
        return render_template("Dashbroad.html",User=session['User'])
    else:
        return render_template("Error_Handler.html",user=user_name)


@my_app.route("/Profile/<target>")
def get_User_Profile(target):
    if request.method == 'GET':
        target_dispo = ["Profile","Details","Credit"]
        #check if already session is opened : 
        response_state = 501
        response_data = {}
        if target == target_dispo[0] and 'User' in session:
            response_state = 200
            response_data = session['User']
        if target == target_dispo[1] and 'User' in session:
            #get the personnel data of the connected user : 
            # fetch user personal data by id = session User 0:
            response_state = 200
            details_id = get_personal_details_by_id(session['User'][0])
            response_data = get_details_by_id(details_id)
        if target == target_dispo[2] and 'User' in session:
            response_state = 200
            response_data = get_payment_details_by_id(session['User'][0])
        return jsonify({'state': response_state, 'data':response_data})


@my_app.route("/GetReccent",methods=['GET'])
def manage_recent():
    if request.method == 'GET':
        # set new connexion to currentmanager : 
        reccent_manager = CurrentUploaded(session['User'][1])
        response_data = reccent_manager.get()
        return jsonify({'response_data': response_data})



@my_app.route("/Upload/<option>",methods=['POST'])
def upload_now(option):
    if request.method == 'POST':
        supported_upload = ['File','Folder']
        if option in supported_upload:
            # check uploads 
            response_message = ""
            response_state = ""
            # check option details:
            if option == supported_upload[0]:
                # upload file : 
                target_file = request.files.to_dict()
                origin_data = request.form.to_dict()
                # upload file : 
                target_file['file'].save(my_app.config['UPLOAD_FOLDER']+""+secure_filename(target_file['file'].filename))
                # manage the data base and the front : 
                # step 1 : add file name to folder target contenet : 
                folder = Folder()
                folder.connect()
                response_push_content = folder.AddContent(
                    origin_data['folder'], target_file['file'])
                # manage the response message : 
                if response_push_content == 1:
                    response_message = "Your file has been loaded."
                    response_state = "custom"
                    # update the last update date : 
                    update_date = folder.updateDate(origin_data['folder'])
                    # update ReccentFiles collecction : 
                    reccent_manager = CurrentUploaded(session['User'][1])
                    reccent_manager.addFile({
                        'Name': target_file['file'].filename
                    })
                else:
                    response_message = "Sorry, we can't load your file, try again."
                    response_state = "danger"
            if option == supported_upload[1]:
                target_files = request.files.getlist('files[]')
                origin_data = request.form.to_dict()
                # we have an folder image to insert liste of files as it's content :
                folder = Folder()
                folder.connect()
                reccent_manager = CurrentUploaded(session['User'][1])
                # for each file upload it :   
                for  file_to_upload in target_files:
                    current_file_name = file_to_upload.filename.split("\r")
                    current_file_name = current_file_name[0].split("/")[1]
                    try:
                        file_to_upload.save(
                            my_app.config['UPLOAD_FOLDER']+""+secure_filename(
                                current_file_name
                            ))
                        folder.AddUploadedContent(
                            origin_data['folder'],
                            file_to_upload)
                        # add files to the current files uploaded : 
                        reccent_manager.addFile(
                            {'Name':current_file_name}
                        )
                        # folder and all files uploaded succuflly :
                        response_message = "All  file has been loaded."
                        response_state = "custom"
                    except Exception as e:
                        # faile to upload Folder :
                        print ("[ Error Upload File ] : "+str(e))
                        response_message = "Sorry, we can't load your file, try again."
                        response_state = "danger"
            return jsonify({'state': response_state,'message': response_message})


@my_app.route("/RestoreManager/<option>", methods=['GET'])
def restore_manager_handler(option):
    # check session : 
    if 'User' in session:
        # check methode : 
        enabel_options_list = ['Deleted']
        if request.method == "GET":
            # check if there is an allowd option : 
            if option in enabel_options_list and enabel_options_list[0] == option :
                # create new restore class instance : 
                delete_manager = DataRestoreManager(UploadFolder, session['User'][1])
                response_data = delete_manager.getAll()
                return jsonify({'response_data':response_data})


if __name__ == '__main__':
    my_app.secret_key = 'super secret key'
    my_app.config['SESSION_TYPE'] = 'filesystem'
    my_app.run(debug=True)