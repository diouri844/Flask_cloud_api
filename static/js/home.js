
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
            // remove active class and show class from the ferst div : 
            document.getElementById("v-pills-step1-tab").classList.remove("active");;
            document.getElementById("v-pills-step1").classList.remove("active");
            document.getElementById("v-pills-step1").classList.remove("show");
            // add show and active  class to seconde div :
            document.getElementById("v-pills-step2-tab").classList.add("active");
            document.getElementById("v-pills-step2").classList.add("active");
            document.getElementById("v-pills-step2").classList.add("show");
            // adding user data to the formdata :
            free_user_data = {
                "name":document.getElementById("exampleInputname").value,
                "Email":document.getElementById("exampleInputEmail1").value,
                "Password":document.getElementById("exampleInputPassword1").value,
                "confirme":document.getElementById("exampleInputPassword1").value,
            }
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
        // remove active class and show class from the ferst div : 
        document.getElementById("v-pills-step2-tab").classList.remove("active");;
        document.getElementById("v-pills-step2").classList.remove("active");
        document.getElementById("v-pills-step2").classList.remove("show");
        // add show and active  class to seconde div :
        document.getElementById("v-pills-step3-tab").classList.add("active");
        document.getElementById("v-pills-step3").classList.add("active");
        document.getElementById("v-pills-step3").classList.add("show");
        // add data : 
        free_user_data['ferstname'] = document.getElementById("userfname").value;
        free_user_data['lastname'] = document.getElementById("userlname").value;
        free_user_data['phonenumber'] = document.getElementById("userphone").value;
        free_user_data['date'] = document.getElementById("userdate").value;
        // check if optional data fields:
        if(document.getElementById("useradrs").value.length!=0){
            free_user_data['adresse'] = document.getElementById("useradrs").value;
        }
        if(document.getElementById("userobjective").value.length!=0){
            free_user_data['objective'] = document.getElementById("userobjective").value ;
        }
        
    }else{
        document.getElementById("freeModalstep1").style.transform = "translateY(-45px)";
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
            free_user_data['CreditCardName'] = document.getElementById("cardname").value;
            free_user_data['CreditCardNumber'] = document.getElementById("cardnumber").value;
            free_user_data['CreditCardDate'] = document.getElementById("carddate").value;
            free_user_data['CreditCardPassword'] = document.getElementById("cardcode").value;
            // define state of account : 
            free_user_data['state_account']="free trial"
            console.log(free_user_data);
            // send data to the back end side : 
            let current_date = new Date();
            let card_date =  new Date(document.getElementById("carddate").value);
            console.log(card_date,current_date);
            if(card_date < current_date){
                // credit date expired :
                console.log(document.getElementById("carddate").value,current_date);
                notify({
                    message: 'credit card date expired',
                    color: 'danger',
                    timeout: 2000
                  });
            }
            let config = {
                headers: {
                  'Content-Type': 'multipart/form-data'
                }
            }
            axios.defaults.baseURL = 'http://127.0.0.1:5000';
            axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
            axios.post('/singup',free_user_data,config);
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
        }else{
            document.getElementById("primuimModalstep1").style.transform = "translateY(-45px)";
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
   // global formdata :
   var free_user_data = {};
   var pro_user_data = {};
   var ninja_user_data = {};
  // selector elements :
  const btn_next_free = document.getElementById("next_btn_free_pill");
  const btn_prev_free_2_to_1 = document.getElementById("btn_prev_free_2");
  const btn_next_free_2_to_3 = document.getElementById("btn_next_free_2");
  const btn_prev_free_3_to_2 = document.getElementById("btn_prev_free_3");
  const btn_submit_free = document.getElementById("btn_submit_free");
  // btn of complet edidition account : 
  const btn_next_pro = document.getElementById("next_btn_pro_pill");
  const btn_prev_pro_2_to_1 = document.getElementById("btn_prev_pro_2");
  const btn_next_pro_2_to_3 = document.getElementById("btn_next_pro_2");
  const btn_prev_pro_3_to_2 = document.getElementById("btn_prev_pro_3");
  // btn of ninja edidition account :
  const btn_next_ninja = document.getElementById("next_btn_ninja_pill");
  const btn_prev_ninja_2_to_1 = document.getElementById("btn_prev_ninja_2");
  const btn_next_ninja_2_to_3 = document.getElementById("btn_next_ninja_2");
  const btn_prev_ninja_3_to_2 = document.getElementById("btn_prev_ninja_3");
  // get chekcbox skip :
  const skip_btn = document.getElementById("skipCheck")
  skip_btn.addEventListener("click",disabel_all_entry,false);
  // add event to elements selected : 
  btn_next_free.addEventListener("click",next_step_free1,false);
  btn_prev_free_2_to_1.addEventListener("click",prev_step_free1,false);
  btn_next_free_2_to_3.addEventListener("click",next_step_free2,false);
  btn_prev_free_3_to_2.addEventListener("click",prev_step_free3,false);
  btn_submit_free.addEventListener("click",send_free_form_data,false);

  btn_next_pro.addEventListener("click",next_step_pro1,false);
  btn_prev_pro_2_to_1.addEventListener("click",prev_step_pro1,false);
  btn_next_pro_2_to_3.addEventListener("click",next_step_pro2,false);
  btn_prev_pro_3_to_2.addEventListener("click",prev_step_pro2,false);
  btn_next_ninja.addEventListener("click",next_step_ninja1,false);
  btn_prev_ninja_2_to_1.addEventListener("click",prev_step_ninja1,false);
  btn_next_ninja_2_to_3.addEventListener("click",next_step_ninja2,false);
  btn_prev_ninja_3_to_2.addEventListener("click",prev_step_ninja2,false)