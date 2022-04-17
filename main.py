from flask import Flask, render_template, request, redirect, url_for, flash, session

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
        print(user_data)
    return user_data





if __name__ == '__main__':
    my_app.secret_key = 'super secret key'
    my_app.config['SESSION_TYPE'] = 'filesystem'
    my_app.run(debug=True)