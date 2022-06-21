from flask import Flask, render_template, request, redirect, url_for, flash, session,jsonify
from Modules.User import *

my_app = Flask(__name__)
# home page :   
@my_app.route('/')
def home():
    # home function body :
    return render_template('Home.html')
#create account link controler :
@my_app.route('/singup',methods=['POST'])
def singup_controler():
    if request.method == 'POST':
        user_data = request.form.to_dict()
        user_name = user_data['name']
        user_email = user_data['Email']
        user_pswd = user_data['Password']
        user_fname = user_data['ferstname']
        user_lname = user_data['lastname']
        user_phone = user_data['phonenumber']
        user_date_join = user_data['date']
        user_account_type = user_data['state_account']
        if len(user_data)==12:
            #send all data includ credit card data :
            user_card_name = user_data['CreditCardName']
            user_card_number = user_data['CreditCardNumber']
            user_card_date = user_data['CreditCardDate']
            user_card_pswd = user_data['CreditCardPassword']
        #check user account :
        if check_user_account(user_name,user_email,user_phone) == True:
            return jsonify({'Response message':"account already exist :) "}) 
        else:
            # create new account : 

            #if len(data )==12 : ==> credit card info is inserted 
            # step 1 : create user basic data 
            # step 2 : update credit card info 
            message = create_user(user_name,user_email,user_pswd,user_fname,user_lname,user_phone,user_date_join,None,user_account_type)
            return jsonify({'response message':" new account data :) "+str(message)})





if __name__ == '__main__':
    my_app.secret_key = 'super secret key'
    my_app.config['SESSION_TYPE'] = 'filesystem'
    my_app.run(debug=True)