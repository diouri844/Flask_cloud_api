
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
    }else{
        document.getElementById("freeModalstep1").style.transform = "translateY(-45px)";
        notify({
            message: 'all required fields must be completed',
            color: 'danger',
            timeout: 2000
          });
    }
  };







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



  // selector elements :
  const btn_next_free = document.getElementById("next_btn_free_pill");
  const btn_prev_free_2_to_1 = document.getElementById("btn_prev_free_2");
  const btn_next_free_2_to_3 = document.getElementById("btn_next_free_2");
  const btn_prev_free_3_to_2 = document.getElementById("btn_prev_free_3");
  // add event to elements selected : 
  btn_next_free.addEventListener("click",next_step_free1,false);
  btn_prev_free_2_to_1.addEventListener("click",prev_step_free1,false);
  btn_next_free_2_to_3.addEventListener("click",next_step_free2,false);
  btn_prev_free_3_to_2.addEventListener("click",prev_step_free3,false);