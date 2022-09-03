
function next_step_free1(){
    let nbr_valide = 0;
    // test if all required input is failed :
    if(document.getElementById("exampleInputname").value.length!=0){
        nbr_valide++;
    }
    if(document.getElementById("exampleInputEmail1").value.length!=0){
        nbr_valide++;
    }
    if(document.getElementById("exampleInputPassword1").value.length!=0){
        nbr_valide++;
    }
    if(document.getElementById("exampleInputPassword2").value.length!=0){
        nbr_valide++;
    }
    if(nbr_valide===4){
        if(document.getElementById("exampleInputPassword1").value===document.getElementById("exampleInputPassword2").value){
            // adding user data to the formdata :
            free_user_data = {
                "name":document.getElementById("exampleInputname").value,
                "Email":document.getElementById("exampleInputEmail1").value,
                "Password":document.getElementById("exampleInputPassword1").value,
                "confirme":document.getElementById("exampleInputPassword1").value,
            }
            // send request to the server :
            axios.defaults.baseURL = 'http://127.0.0.1:5000';
            axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
            axios.post('/singup/Account_setup',free_user_data,config)
            .then(response=>{
                notify({
                    message: response.data.message,
                    color: response.data.state,
                    timeout: 2000
                });
                if(response.data.state === "success"){
                    setTimeout(
                        ()=>{
                            // remove active class and show class from the ferst div : 
                            document.getElementById("v-pills-step1-tab").classList.remove("active");;
                            document.getElementById("v-pills-step1").classList.remove("active");
                            document.getElementById("v-pills-step1").classList.remove("show");
                            // add show and active  class to seconde div :
                            document.getElementById("v-pills-step2-tab").classList.add("active");
                            document.getElementById("v-pills-step2").classList.add("active");
                            document.getElementById("v-pills-step2").classList.add("show");
                        },1500
                    );
                }
            }).catch(error=>{
                console.error(error);
            });
        }else{
            notify({
                message: 'Password and confirmation password must be the same',
                color: 'success',
                timeout: 1000
              });
        }
        
    }else{
        notify({
            message: 'all fields must be completed',
            color: 'danger',
            timeout: 2000
          });
    }
  };

function prev_step_free1(){
    // remove active class and show class from the ferst div : 
    document.getElementById("v-pills-step2-tab").classList.remove("active");;
    document.getElementById("v-pills-step2").classList.remove("active");
    document.getElementById("v-pills-step2").classList.remove("show");
    // add show and active  class to seconde div :
    document.getElementById("v-pills-step1-tab").classList.add("active");
    document.getElementById("v-pills-step1").classList.add("active");
    document.getElementById("v-pills-step1").classList.add("show");
    console.log("prev is clicked");
};

function next_step_free2(){
    console.log(free_user_data);
    var nbr_valide = 0;
    if(document.getElementById("userfname").value.length!=0){
        nbr_valide++;
    }
    if(document.getElementById("userlname").value.length!=0){
        nbr_valide++;
    }
    if(document.getElementById("userphone").value.length!=0){
        nbr_valide++;
    }
    if(document.getElementById("userdate").value){
        nbr_valide++;
    }
    if(nbr_valide===4){
        // add data : 
        let user_free_details = new FormData();
        user_free_details.append('ferstname',document.getElementById("userfname").value);
        user_free_details.append('lastname',document.getElementById("userlname").value);
        user_free_details.append('phonenumber',document.getElementById("userphone").value);
        var d = new Date();
        user_free_details.append('date',d.getDay()+"/"+d.getMonth()+"/"+d.getFullYear());
        user_free_details.append('state_account',"free trial");
        user_free_details.append('name',free_user_data['name']);
        // send data to to backend api :
        axios.defaults.baseURL = 'http://127.0.0.1:5000';
        axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
        axios.post('/singup/Personal_data',user_free_details,config)
        .then(response=>{
            if(response.data.state === 'success' ){
                // remove active class and show class from the ferst div : 
                document.getElementById("v-pills-step2-tab").classList.remove("active");;
                document.getElementById("v-pills-step2").classList.remove("active");
                document.getElementById("v-pills-step2").classList.remove("show");
                // add show and active  class to seconde div :
                document.getElementById("v-pills-step3-tab").classList.add("active");
                document.getElementById("v-pills-step3").classList.add("active");
                document.getElementById("v-pills-step3").classList.add("show");
            }
            setTimeout(()=>{
                notify({
                    message: response.data.message,
                    color: response.data.state,
                    timeout: 2000
                });
            },1500);
        })
        .catch(error => {
            console.error(error);
        });
        
    }else{
        notify({
            message: 'all required fields must be completed',
            color: 'danger',
            timeout: 2000
          });
    }
};

function send_free_form_data(){
    // get chekcbox value : 
    if(document.getElementById("skipCheck").checked===true){
        // skipe card credit for now
        document.getElementById("close_btn_free").click();
    }else{
        // check if all required input is failed :
        let nbr_valide = 0;
        if(document.getElementById("cardname").value.length!=0){
            nbr_valide++;
        }
        if(document.getElementById("cardnumber").value.length!=0){
            nbr_valide++;
        }
        if(document.getElementById("carddate").value.length!=0){
            nbr_valide++;
        }
        if(document.getElementById("cardcode").value.length!=0){
            nbr_valide++;
        }
        if(nbr_valide===4){
            // add data :
            let credit_card_info = new FormData();
            credit_card_info.append('CreditCardName',document.getElementById("cardname").value);
            credit_card_info.append('CreditCardNumber',document.getElementById("cardnumber").value);
            credit_card_info.append('CreditCardDate',document.getElementById("carddate").value);
            credit_card_info.append('CreditCardPassword',document.getElementById("cardcode").value);
            credit_card_info.append('name',free_user_data['name']);
            // send credit card data to the backend server :
            axios.defaults.baseURL = 'http://127.0.0.1:5000';
            axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
            axios.post('/singup/Payment_details',credit_card_info,config)
            .then(response => {
                notify({
                    message: response.data.message,
                    color: response.data.state,
                    timeout: 2000
                });
                if (response.data.state === "success"){
                    const btnlogin = document.getElementById("btn_login_link");
                    document.getElementById("close_btn_free").click();
                    btnlogin.click();
                }
            })
            .catch(error => {
                console.error(error);
            })
        }else{
            notify({
                message: 'all required fields must be completed',
                color: 'danger',
                timeout: 2000
            });
        }
    }
  }


  function prev_step_free3(){
    // remove active class and show class from the ferst div : 
    document.getElementById("v-pills-step3-tab").classList.remove("active");;
    document.getElementById("v-pills-step3").classList.remove("active");
    document.getElementById("v-pills-step3").classList.remove("show");
    // add show and active  class to seconde div :
    document.getElementById("v-pills-step2-tab").classList.add("active");
    document.getElementById("v-pills-step2").classList.add("active");
    document.getElementById("v-pills-step2").classList.add("show");
    console.log("prev 3 is clicked");
  }

  function disabel_all_entry(){
      state = true;
      document.getElementById("cardname").disabled = !document.getElementById("cardname").disabled;
      document.getElementById("cardnumber").disabled = !document.getElementById("cardnumber").disabled;
      document.getElementById("carddate").disabled = !document.getElementById("carddate").disabled;
      document.getElementById("cardcode").disabled = !document.getElementById("cardcode").disabled;
  }

  function next_step_pro1(){
    // check if all required input is failed:
    let nbr_valide = 0;
    if(document.getElementById("proInputname").value.length!=0){
        nbr_valide++;
    }
    if(document.getElementById("proInputEmail1").value.length!=0){
        nbr_valide++;
    }
    if(document.getElementById("proInputPassword1").value.length!=0){
        nbr_valide++;
    }
    if(document.getElementById("proInputPassword2").value.length!=0){
        nbr_valide++;
    }
    if(nbr_valide===4){
        if(document.getElementById("proInputPassword1").value===document.getElementById("proInputPassword2").value){
            // adding user data to the formdata :
            free_user_data = {
                "name":document.getElementById("proInputname").value,
                "Email":document.getElementById("proInputEmail1").value,
                "Password":document.getElementById("proInputPassword2").value
            };
            // send request to the server :
            axios.defaults.baseURL = 'http://127.0.0.1:5000';
            axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
            axios.post('/singup/Account_setup',free_user_data,config)
            .then(response => {
                notify({
                    message: response.data.message,
                    color: response.data.state,
                    timeout: 2000
                });
                if(response.data.state === "success"){
                    setTimeout(
                        ()=>{
                            // hiding ferst div :  
                            document.getElementById("prim-pills-step1").classList.remove("active");
                            document.getElementById("prim-pills-step1").classList.remove("show");
                            // disabled btn step 1 enable btn step 2:
                            document.getElementById("prim-pills-step1-tab").classList.remove("active");
                            document.getElementById("prim-pills-step1-tab").classList.remove("btn");
                            document.getElementById("prim-pills-step1-tab").classList.remove("btn-outline-secondary");
                            document.getElementById("prim-pills-step2-tab").classList.add("active");
                            document.getElementById("prim-pills-step2-tab").classList.add("btn");
                            document.getElementById("prim-pills-step2-tab").classList.add("btn-outline-secondary");
                            // display seconde div :
                            document.getElementById("prim-pills-step2").classList.add("active");
                            document.getElementById("prim-pills-step2").classList.add("show");
                        },1500
                    );
                }
            })
            .catch(error => {
                console.log(error);
            })
            
        }else{
            notify({
                message: 'Password and confirmation password must be the same',
                color: 'success',
                timeout: 1000
              });
        }
    }else{
        notify({
            message: 'all required fields must be completed',
            color: 'danger',
            timeout: 2000
          });
    }
  }

function prev_step_pro1(){
    // hiding ferst div :  
    document.getElementById("prim-pills-step2").classList.remove("active");
    document.getElementById("prim-pills-step2").classList.remove("show");
    // disabled btn step 1 enable btn step 2:
    document.getElementById("prim-pills-step2-tab").classList.remove("active");
    document.getElementById("prim-pills-step2-tab").classList.remove("btn");
    document.getElementById("prim-pills-step2-tab").classList.remove("btn-outline-secondary");
    document.getElementById("prim-pills-step1-tab").classList.add("active");
    document.getElementById("prim-pills-step1-tab").classList.add("btn");
    document.getElementById("prim-pills-step1-tab").classList.add("btn-outline-secondary");
    // display seconde div :
    document.getElementById("prim-pills-step1").classList.add("active");
    document.getElementById("prim-pills-step1").classList.add("show");
}

function next_step_pro2(){
    // check if all required input is failed :
    let nbr_valide = 0;
    if(document.getElementById("userprofname").value.length!=0){
        nbr_valide++;
    }
    if(document.getElementById("userprolname").value.length!=0){
        nbr_valide++;
    }
    if(document.getElementById("userprophone").value.length!=0){
        nbr_valide++;
    }
    if(document.getElementById("userprodate").value.length!=0){
        nbr_valide++;
    }
    if(nbr_valide===4){
        // add data : 
        let user_free_details = new FormData();
        user_free_details.append('ferstname',document.getElementById("userprofname").value);
        user_free_details.append('lastname',document.getElementById("userprolname").value);
        user_free_details.append('phonenumber',document.getElementById("userprophone").value);
        var d = new Date();
        user_free_details.append('date',d.getDay()+"/"+d.getMonth()+"/"+d.getFullYear());
        user_free_details.append('state_account',"Complet edition");
        user_free_details.append('name',free_user_data['name']);
        // send data to to backend api :
        axios.defaults.baseURL = 'http://127.0.0.1:5000';
        axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
        axios.post('/singup/Personal_data',user_free_details,config)
        .then(response => {
            if(response.data.state === 'success' ){
                // hiding ferst div :  
                    document.getElementById("prim-pills-step2").classList.remove("active");
                    document.getElementById("prim-pills-step2").classList.remove("show");
                    // disabled btn step 1 enable btn step 2:
                    document.getElementById("prim-pills-step2-tab").classList.remove("active");
                    document.getElementById("prim-pills-step2-tab").classList.remove("btn");
                    document.getElementById("prim-pills-step2-tab").classList.remove("btn-outline-secondary");
                    document.getElementById("prim-pills-step3-tab").classList.add("active");
                    document.getElementById("prim-pills-step3-tab").classList.add("btn");
                    document.getElementById("prim-pills-step3-tab").classList.add("btn-outline-secondary");
                    // display seconde div :
                    document.getElementById("prim-pills-step3").classList.add("active");
                    document.getElementById("prim-pills-step3").classList.add("show");        
            }
            setTimeout(()=>{
                notify({
                    message: response.data.message,
                    color: response.data.state,
                    timeout: 2000
                });
            },1500);
        })
        .catch(error => {
            console.log(error);
        });
        
        }else{
            document.getElementById("primuimModalstep1").style.transform = "translateY(-45px)";
            notify({
                message: 'all required fields must be completed',
                color: 'danger',
                timeout: 2000
            });
    }
}


function send_pro_form_data(){
    // check if all required input is failed :
        let nbr_valide = 0;
        if(document.getElementById("cardproname").value.length!=0){
            nbr_valide++;
        }
        if(document.getElementById("cardpronumber").value.length!=0){
            nbr_valide++;
        }
        if(document.getElementById("cardprodate").value.length!=0){
            nbr_valide++;
        }
        if(document.getElementById("cardprocode").value.length!=0){
            nbr_valide++;
        }
        if(nbr_valide===4){
             // add data :
            let credit_card_info = new FormData();
            credit_card_info.append('CreditCardName',document.getElementById("cardproname").value);
            credit_card_info.append('CreditCardNumber',document.getElementById("cardpronumber").value);
            credit_card_info.append('CreditCardDate',document.getElementById("cardprodate").value);
            credit_card_info.append('CreditCardPassword',document.getElementById("cardprocode").value);
            credit_card_info.append('name',free_user_data['name']);
            // send credit card data to the backend server :
            axios.defaults.baseURL = 'http://127.0.0.1:5000';
            axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
            axios.post('/singup/Payment_details',credit_card_info,config)
            .then(response => {
                notify({
                    message: response.data.message,
                    color: response.data.state,
                    timeout: 2000
                });
                if (response.data.state === "success"){
                    const btnlogin = document.getElementById("btn_login_link");
                    document.getElementById("btn-close-pro").click();
                    btnlogin.click();
                }
            })
            .catch(error => {
                console.error(error);
            });
        }else{
            notify({
                message: 'all required fields must be completed',
                color: 'danger',
                timeout: 2000
            });
        }
}





function prev_step_pro2(){
    // hiding ferst div :  
    document.getElementById("prim-pills-step3").classList.remove("active");
    document.getElementById("prim-pills-step3").classList.remove("show");
    // disabled btn step 1 enable btn step 2:
    document.getElementById("prim-pills-step3-tab").classList.remove("active");
    document.getElementById("prim-pills-step3-tab").classList.remove("btn");
    document.getElementById("prim-pills-step3-tab").classList.remove("btn-outline-secondary");
    document.getElementById("prim-pills-step2-tab").classList.add("active");
    document.getElementById("prim-pills-step2-tab").classList.add("btn");
    document.getElementById("prim-pills-step2-tab").classList.add("btn-outline-secondary");
    // display seconde div :
    document.getElementById("prim-pills-step2").classList.add("active");
    document.getElementById("prim-pills-step2").classList.add("show");
}

function next_step_ninja1(){
    // check if all required input is failed :
    let nbr_valide = 0;
    if(document.getElementById("ninjaInputname").value.length!=0){
        nbr_valide++;
    }
    if(document.getElementById("ninjaInputEmail1").value.length!=0){
        nbr_valide++;
    }
    if(document.getElementById("ninjaInputPassword1").value.length!=0){
        nbr_valide++;
    }
    if(document.getElementById("ninjaInputPassword2").value.length!=0){
        nbr_valide++;
    }
    if(nbr_valide===4){
        if(document.getElementById("ninjaInputPassword1").value===document.getElementById("ninjaInputPassword2").value){
            // adding user data to the formdata :
            free_user_data = {
                "name":document.getElementById("ninjaInputname").value,
                "Email":document.getElementById("ninjaInputEmail1").value,
                "Password":document.getElementById("ninjaInputPassword1").value,
            }
            // send request to the server :
            axios.defaults.baseURL = 'http://127.0.0.1:5000';
            axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
            axios.post('/singup/Account_setup',free_user_data,config)
            .then( response => {
                notify({
                    message: response.data.message,
                    color: response.data.state,
                    timeout: 2000
                });
                if(response.data.state === "success"){
                    setTimeout(
                        ()=>{
                            // hiding ferst div :
                            document.getElementById("ninja-pills-step1").classList.remove("active");
                            document.getElementById("ninja-pills-step1").classList.remove("show");
                            // disabled btn step 1 enable btn step 2:
                            document.getElementById("ninja-pills-step1-tab").classList.remove("active");
                            document.getElementById("ninja-pills-step1-tab").classList.remove("btn");
                            document.getElementById("ninja-pills-step1-tab").classList.remove("btn-outline-warning");
                            document.getElementById("ninja-pills-step2-tab").classList.add("active");
                            document.getElementById("ninja-pills-step2-tab").classList.add("btn");
                            document.getElementById("ninja-pills-step2-tab").classList.add("btn-outline-warning");
                            // display seconde div :
                            document.getElementById("ninja-pills-step2").classList.add("active");
                            document.getElementById("ninja-pills-step2").classList.add("show");             
                        },1500
                    );
                }
            })
            .catch( error => {
                console.error(error);
            });
        }else{
            notify({
                message: 'Password and confirmation password must be the same',
                color: 'success',
                timeout: 1000
              });
        }
    }else{
        notify({
            message: 'all required fields must be completed',
            color: 'danger',
            timeout: 2000
        });
    }
}

function prev_step_ninja1(){
     // hiding ferst div :
     document.getElementById("ninja-pills-step2").classList.remove("active");
     document.getElementById("ninja-pills-step2").classList.remove("show");
     // disabled btn step 1 enable btn step 2:
     document.getElementById("ninja-pills-step2-tab").classList.remove("active");
     document.getElementById("ninja-pills-step2-tab").classList.remove("btn");
     document.getElementById("ninja-pills-step2-tab").classList.remove("btn-outline-warning");
     document.getElementById("ninja-pills-step1-tab").classList.add("active");
     document.getElementById("ninja-pills-step1-tab").classList.add("btn");
     document.getElementById("ninja-pills-step1-tab").classList.add("btn-outline-warning");
     // display seconde div :
     document.getElementById("ninja-pills-step1").classList.add("active");
     document.getElementById("ninja-pills-step1").classList.add("show");
}

function next_step_ninja2(){
    //check input :
    let nbr_valide = 0;
    if(document.getElementById("userninjafname").value.length!=0){
        nbr_valide++;
    }
    if(document.getElementById("userninjalname").value.length!=0){
        nbr_valide++;
    }
    if(document.getElementById("userninjaphone").value.length!=0){
        nbr_valide++;
    }
    if(document.getElementById("userninjadate").value.length!=0){
        nbr_valide++;
    }
    if(nbr_valide === 4){
        let user_free_details = new FormData();
        user_free_details.append('ferstname',document.getElementById("userninjafname").value);
        user_free_details.append('lastname',document.getElementById("userninjalname").value);
        user_free_details.append('phonenumber',document.getElementById("userninjaphone").value);
        var d = new Date();
        user_free_details.append('date',d.getDay()+"/"+d.getMonth()+"/"+d.getFullYear());
        user_free_details.append('state_account',"Ultimate Edition");
        user_free_details.append('name',free_user_data['name']);
        // send data to to backend api :
        axios.defaults.baseURL = 'http://127.0.0.1:5000';
        axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
        axios.post('/singup/Personal_data',user_free_details,config)
        .then(response => {
             if(response.data.state === 'success' ){
                    // hiding ferst div :
                    document.getElementById("ninja-pills-step2").classList.remove("active");
                    document.getElementById("ninja-pills-step2").classList.remove("show");
                    // disabled btn step 1 enable btn step 2:
                    document.getElementById("ninja-pills-step2-tab").classList.remove("active");
                    document.getElementById("ninja-pills-step2-tab").classList.remove("btn");
                    document.getElementById("ninja-pills-step2-tab").classList.remove("btn-outline-warning");
                    document.getElementById("ninja-pills-step3-tab").classList.add("active");
                    document.getElementById("ninja-pills-step3-tab").classList.add("btn");
                    document.getElementById("ninja-pills-step3-tab").classList.add("btn-outline-warning");
                    // display seconde div :
                    document.getElementById("ninja-pills-step3").classList.add("active");
                    document.getElementById("ninja-pills-step3").classList.add("show");
            }
            setTimeout(()=>{
                notify({
                    message: response.data.message,
                    color: response.data.state,
                    timeout: 2000
                });
            },1500);
        })
        .catch(error => {
            console.log(error);
        });
    }else{
        notify({
            message: 'all required fields must be completed',
            color: 'danger',
            timeout: 2000
          });
    }
}


function send_ninja_form_data(){
    let nbr_valide = 0;
    if(document.getElementById("cardninjaname").value.length!=0){
        nbr_valide++;
    }
    if(document.getElementById("cardninjanumber").value.length!=0){
        nbr_valide++;
    }
    if(document.getElementById("cardninjadate").value.length!=0){
        nbr_valide++;
    }
    if(document.getElementById("cardninjacode").value.length!=0){
        nbr_valide++;
    }
    if(nbr_valide === 4){
        // add data :
        let credit_card_info = new FormData();
        credit_card_info.append('CreditCardName',document.getElementById("cardninjaname").value);
        credit_card_info.append('CreditCardNumber',document.getElementById("cardninjanumber").value);
        credit_card_info.append('CreditCardDate',document.getElementById("cardninjadate").value);
        credit_card_info.append('CreditCardPassword',document.getElementById("cardninjacode").value);
        credit_card_info.append('name',free_user_data['name']);
        // send credit card data to the backend server :
        axios.defaults.baseURL = 'http://127.0.0.1:5000';
        axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
        axios.post('/singup/Payment_details',credit_card_info,config)
        .then( response => {
            notify({
                    message: response.data.message,
                    color: response.data.state,
                    timeout: 2000
                });
                if (response.data.state === "success"){
                    const btnlogin = document.getElementById("btn_login_link");
                    document.getElementById("btn-close-ninja").click();
                    btnlogin.click();
                }
        })
        .catch(error => {
            console.error(error);
        });
    }else{
        notify({
                message: 'all required fields must be completed',
                color: 'danger',
                timeout: 2000
            });
    }
}



function prev_step_ninja2(){
    // hiding ferst div :
    document.getElementById("ninja-pills-step3").classList.remove("active");
    document.getElementById("ninja-pills-step2").classList.remove("show");
    // disabled btn step 1 enable btn step 2:
    document.getElementById("ninja-pills-step3-tab").classList.remove("active");
    document.getElementById("ninja-pills-step3-tab").classList.remove("btn");
    document.getElementById("ninja-pills-step3-tab").classList.remove("btn-outline-warning");
    document.getElementById("ninja-pills-step2-tab").classList.add("active");
    document.getElementById("ninja-pills-step2-tab").classList.add("btn");
    document.getElementById("ninja-pills-step2-tab").classList.add("btn-outline-warning");
    // display seconde div :
    document.getElementById("ninja-pills-step2").classList.add("active");
    document.getElementById("ninja-pills-step2").classList.add("show");
}

function login_in_now(){
    let nbr_valide = 0;
    if(document.getElementById("LoginInputname").value.length!=0){
        nbr_valide++;
    }
    if(document.getElementById("LoginInputEmail1").value.length!=0){
        nbr_valide++;
    }
    if(document.getElementById("LoginInputPassword1").value.length!=0){
        nbr_valide++;
    }
    if( nbr_valide === 3){
        let login_data = new FormData();
        login_data.append('UserName',document.getElementById("LoginInputname").value);
        login_data.append('UserEmail',document.getElementById("LoginInputEmail1").value);
        login_data.append('UserPassword',document.getElementById("LoginInputPassword1").value);
        axios.defaults.baseURL = 'http://127.0.0.1:5000';
        axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
        axios.post('/singin',login_data,config)
        .then( response => {
            notify({
                    message: response.data.message,
                    color: response.data.state,
                    timeout: 2000
                });
        })
        .catch(error => {
            console.error(error);
        })
    }else{
        notify({
            message: 'all required fields must be completed',
            color: 'danger',
            timeout: 2000
        });
    }
}





// global formdata :
   var free_user_data = {};
   var pro_user_data = {};
   var ninja_user_data = {};
   var config = {};
   var state = false;
// setup my axios config header :
    config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
    };
  // selector elements :
  const btn_next_free = document.getElementById("next_btn_free_pill");
  //const btn_prev_free_2_to_1 = document.getElementById("btn_prev_free_2");
  const btn_next_free_2_to_3 = document.getElementById("btn_next_free_2");
  //const btn_prev_free_3_to_2 = document.getElementById("btn_prev_free_3");
  const btn_submit_free = document.getElementById("btn_submit_free");
  // btn of complet edidition account : 
  const btn_next_pro = document.getElementById("next_btn_pro_pill");
  //const btn_prev_pro_2_to_1 = document.getElementById("btn_prev_pro_2");
  const btn_next_pro_2_to_3 = document.getElementById("btn_next_pro_2");
  //const btn_prev_pro_3_to_2 = document.getElementById("btn_prev_pro_3");
  const btn_submit_pro = document.getElementById("btn-submit-pro-plan");
  
  
 const bnt_login_user = document.getElementById("Login_in");
 gbnt_login_user.addEventListener("click",login_in_now,false);



  // btn of ninja edidition account :
  const btn_next_ninja = document.getElementById("next_btn_ninja_pill");
  //const btn_prev_ninja_2_to_1 = document.getElementById("btn_prev_ninja_2");
  const btn_next_ninja_2_to_3 = document.getElementById("btn_next_ninja_e2");
  //const btn_prev_ninja_3_to_2 = document.getElementById("btn_prev_ninja_3");
  const btn_submit_ninja = document.getElementById("btn-submit-ninja");
  
  
  // get chekcbox skip :
  const skip_btn = document.getElementById("skipCheck")
  skip_btn.addEventListener("click",disabel_all_entry,false);
  // add event to elements selected : 
  btn_next_free.addEventListener("click",next_step_free1,false);
  //btn_prev_free_2_to_1.addEventListener("click",prev_step_free1,false);
  btn_next_free_2_to_3.addEventListener("click",next_step_free2,false);
  //btn_prev_free_3_to_2.addEventListener("click",prev_step_free3,false);
  btn_submit_free.addEventListener("click",send_free_form_data,false);

  btn_next_pro.addEventListener("click",next_step_pro1,false);
  //btn_prev_pro_2_to_1.addEventListener("click",prev_step_pro1,false);
  btn_next_pro_2_to_3.addEventListener("click",next_step_pro2,false);
  //btn_prev_pro_3_to_2.addEventListener("click",prev_step_pro2,false);
  btn_submit_pro.addEventListener("click",send_pro_form_data,false);
  
  btn_next_ninja.addEventListener("click",next_step_ninja1,false);
  //btn_prev_ninja_2_to_1.addEventListener("click",prev_step_ninja1,false);
  btn_next_ninja_2_to_3.addEventListener("click",next_step_ninja2,false);
  //btn_prev_ninja_3_to_2.addEventListener("click",prev_step_ninja2,false)
  btn_submit_ninja.addEventListener("click",send_ninja_form_data,false);