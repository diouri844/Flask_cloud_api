// selecte elements to working with :

//const btn = document.querySelector(".nav-toggle");
const links = document.querySelector(".links");
const nav_header = document.getElementById("nav_profile");

// add eventListener to button :

nav_header.addEventListener("click",function(){
  const element = document.querySelector(".user_services");
  if(element.style.display === 'flex'){
    element.style.display = 'none';
  }else{
    element.style.display = 'flex';
  }
});


function toggle_my_links(){
  links.classList.toggle("show-links");
}

// services functions :

function create_folder() {
  // display modal :
  document.querySelector(".modal-overlay").classList.add("open-modal");
  document.querySelector(".folder_name").focus();
};

function insertNewFolder(){
  const folder_name = document.getElementById("folder_name_input").value;
  let folder_data = new FormData();
  folder_data.append('FolderName',folder_name);
  axios.defaults.baseURL = 'http://127.0.0.1:5000';
  axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
  axios.post('/Folder',folder_data,config)
  .then(response => {
    notify({
            message: response.data.message,
            color: 'custom',
            timeout: 2500
    });
    // close the popup :
    close_add_folder()
    loading = true;
  })
  .catch(err=> {
    console.error(err);
  });
}


function close_add_folder(){
  document.querySelector(".modal-overlay").classList.remove("open-modal");
}

function handlerFolderClick(event){
  const target_folder_id = event.path[1].id;
  //var target_ui = document.getElementById("btn-serve-"+target_folder_id);
  var target_ui = document.getElementById("btn-serve-"+target_folder_id);
  const parent_div = document.getElementById(target_folder_id)
  // add bottons  :  
  if (target_ui.style.display === "none"){
    target_ui.style.display = "flex";
    // detect evenet : 
    const btn_open_current_folder = document.getElementById("btn-open-"+target_folder_id);
    const btn_delete_current_folder = document.getElementById("btn-delete-"+target_folder_id);
    const btn_share_current_folder = document.getElementById("btn-share-"+target_folder_id);
    // disabled the global div event listener :
    btn_open_current_folder.addEventListener("click",(event)=>{
      //console.log(" open : ",target_folder_id,event);
      //console.log(FOLDER_LIST);
      let current_folder = FOLDER_LIST.filter((iterator)=>{
        return iterator.Name === target_folder_id
      })[0];
      console.log(current_folder);
      const target = document.querySelector(".open-modal-overlay");
      // show the target div : 
      target.classList.add("open-modal");
      const header_div = document.querySelector(".open-folder-header");
      const body_div = document.querySelector(".open-folder-body");
      const body_details = document.querySelector(".open-folder-body-data");
      // add some html : 
      header_div.innerHTML = `
        <h4 class="opened-folder_name"><i class="fas fa-folder-open"></i> ${ current_folder.Name } </h4>
        <button type="button" class="btn-close close-opened-folder" aria-label="Close"></button>
      `;
      body_div.innerHTML = `
      <div class="opened-folder-details">
          <h6><i class="fas fa-clock"></i> ${ current_folder.CreateAt } </h6>
          <h6 type="button" class="folder-services" data-bs-toggle="tooltip" data-bs-placement="top" title="find">
              <input class="sub-search-input" type="text" placeholder="Search" id="search-folder-data-input">
              <i class="fas fa-search" id="search-folder-data-btn"></i>
              </h6>
          <h6 type="button" class="folder-services" data-bs-toggle="tooltip" data-bs-placement="top" title="add to the folder ">
  				    <i class="fas fa-plus"></i>
			    </h6>
          <h6 type="button" class="folder-services" data-bs-toggle="tooltip" data-bs-placement="top" title="remove from the folder">
  				    <i class="fas fa-minus"></i>
			    </h6>
          <h6 type="button" class="folder-services" data-bs-toggle="tooltip" data-bs-placement="top" title="sort by">
  				    <i class="fas fa-bars"></i>
			    </h6>
      </div>
      `;
      // get all content of the selected folder : 
      if (current_folder.Content.length != 0){
        let content_display = current_folder.Content.map((sub_element)=>{
        return `
        <div class="sub-folder-item">
          <h6 class="sub-item-name"> ${sub_element.Name }</h6>
          <h6 class="sub-item-type"> ${sub_element.Type }</h6>
          <h6 class="sub-item-date"> ${sub_element.Date }</h6>
        </div>
        `;
      });
      body_details.innerHTML = content_display.join("");
      }else{
        body_details.innerHTML = `
        <div class="sub-folder-item">
          <h5> Your folder does not have files yet </h5>
        </div>
        `;
      }
      // fonctionne search services : 
      const btn_search_sub_item = document.getElementById("search-folder-data-btn");
      btn_search_sub_item.addEventListener("click",()=>{
        // get the input : 
        const search_target = document.getElementById("search-folder-data-input").value;
        console.log("search for : ",search_target," in ",current_folder.Content);
        // filter array of sub items : 
        let result_of_search  = current_folder.Content.find((item)=>{
          return item.Name === search_target;
        });
        console.log(result_of_search);
        let search_display ="";
        if(result_of_search){
        search_display  = `
          <div class="sub-folder-item">
            <h6 class="sub-item-name"> ${result_of_search.Name }</h6>
            <h6 class="sub-item-type"> ${result_of_search.Type }</h6>
            <h6 class="sub-item-date"> ${result_of_search.Date }</h6>
          </div>
        `;
        }else{
        search_display = `
          <div class="sub-folder-item">
            <h6> No search result founded       <i class="fas fa-frown"></i></h6> 
          </div>
        `;
        }
        // display  result of search : 
        const body_details = document.querySelector(".open-folder-body-data");
        setTimeout(()=>{
          target.classList.remove("open-modal");  
        },3500);
        body_details.innerHTML = search_display;
      },false);
      // manage the close button : 
      const btn_close = document.querySelector(".close-opened-folder");
      btn_close.addEventListener("click",()=>{
        target.classList.remove("open-modal");
      },false);
    },false);



    btn_delete_current_folder.addEventListener("click", (event)=>{
      console.log(" delete : ",event.path[1].id);
      // filter array and delete the target 
      FOLDER_LIST = FOLDER_LIST.filter((iterator)=>{
        return iterator.Name != target_folder_id
      });
      console.log(FOLDER_LIST);
      const div_list_folders = document.querySelector(".folder-handler");
      // send delete request to the backend api : 
      div_list_folders.innerHTML = displayFoldeItems(FOLDER_LIST).join("");
    },false);
    
  
    btn_share_current_folder.addEventListener("click", (event)=>{
      console.log(" share : ",event.path[1].id);
    },false);
  }
  else{
    target_ui.style.display = "none";
  }
}


// ======================       global btns services :    =======================================================

// global state manager :

function displayFoldeItems(folder_items){
  let displaye = folder_items.map(function(item){
    /*
    Content: []
    CreateAt: "2022-09-22"  
    LastUpdate: "2022-09-22"
    Name: "last teste"
    Owner: "chopen"
    Size: 0
    */
    return `<div class="folder-item" id="${item.Name}">
    <h4 class="folder-item-Name" "> 
    <i class="fas fa-folder"></i>
    ${item.Name}
    <span class="creating-date">${ item.CreateAt }</span>
    </h4>
    <h7 class="folder-item-date"><i class="fas fa-clock"></i> Last update :  ${ item.LastUpdate }</h7>
    <div class="btn-serv-folder" id="btn-serve-${ item.Name}">
      <button class="btn-open-folder" id="btn-open-${ item.Name}"><i class="fas fa-folder-open"></i></button>
      <button class="btn-delete-folder" id="btn-delete-${ item.Name}"><i class="fas fa-trash"></i></button>
      <button class="btn-share-folder" id="btn-share-${ item.Name}"><i class="fas fa-share"></i></button>  
  </div>
    </div>`;
  });
  return displaye;
};



function getAllFolders(){
  // send get request to the backend api : 
  axios.defaults.baseURL = 'http://127.0.0.1:5000';
  axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
  axios.get("/Folder",config)
  .then( response => {
    //console.log(response.data.Folders);
    let liste_folders = response.data.Folders;
    FOLDER_LIST = response.data.Folders;
    // get the div target :
    const div_list_folders = document.querySelector(".folder-handler");
    div_list_folders.innerHTML = displayFoldeItems(liste_folders).join("");
    const folders_target = document.querySelectorAll(".folder-item");
    folders_target.forEach(folder_div => {
    folder_div.addEventListener("click",handlerFolderClick,false);
    });
    loading = false;
  })
  .catch(error => {
    console.error(error);
    loading = false;
  });
}

// user settings : 

function display_user_profile(){

  // add the display class : 
  document.querySelector(".update-modal-overlay").classList.add("open-modal");
  
  check_display_content();
  // setup the switch :
  const btn_show_profile = document.querySelector(".fa-address-card");
  const btn_show_data = document.querySelector(".fa-file-user");
  const btn_show_credit = document.querySelector(".fa-credit-card");
  btn_show_profile.addEventListener("click",()=>{
    DISPLAY_USER_PROFILE = true;
    DISPLAY_USER_DATA = false;
    DISPLAY_USER_CREDIT_CARD = false;
    check_display_content();
  },false);
  btn_show_data.addEventListener("click",()=>{
    DISPLAY_USER_PROFILE = false;
    DISPLAY_USER_DATA = true;
    DISPLAY_USER_CREDIT_CARD = false;
    check_display_content()
  },false);
  btn_show_credit.addEventListener("click",()=>{
    DISPLAY_USER_PROFILE = false;
    DISPLAY_USER_DATA = false;
    DISPLAY_USER_CREDIT_CARD = true;
    check_display_content()
  },false);
  //
}

function check_display_content(){
  // stock the current data : 
  let origin_user_profile = new FormData();
  let origin_user_details = new FormData();
  let origin_user_credit = new FormData();
  //const btn_save = document.getElementById("btn-update-profile");
  //step 1: active user profile router :
  if(DISPLAY_USER_PROFILE === true){
    document.querySelector(".fa-address-card").classList.add("active-fal");
    document.querySelector(".fa-file-user").classList.remove("active-fal");
    document.querySelector(".fa-credit-card").classList.remove("active-fal");
    //step 2: get user data from endpoint :
    axios.defaults.baseURL = 'http://127.0.0.1:5000';
    axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
    axios.get("/Profile/Profile",config)
    .then( response => {
      if(response.data.state === 200){
        // user exist and data geted : 
        origin_user_profile.append('userName',response.data.data[1]);
        origin_user_profile.append('userEmail',response.data.data[2]);
        origin_user_profile.append('userPassword',response.data.data[3]);
        document.querySelector(".update-form-body").innerHTML  = `
        <input type="text" id="UserName" class="UpdateProfileName" value=${response.data.data[1]} placeholder="User Name"/>
        <input type="email" id="UserEmail" class="UpdateProfileEmail" value=${response.data.data[2]} placeholder="Email"/>
        <input type="password" id="UserPassword" class="UpdateProfilePassword" value=${response.data.data[3]} placeholder="Password"/>
        `;
        document.querySelector('.popup-btns').innerHTML = `
          <button class="btn-update" id="btn-update-profile"> Save  </button>
          <button class="btn-cancel close-Update"> Close </button>
        `;
        document.querySelector(".close-Update").addEventListener("click",()=>{
            document.querySelector(".update-modal-overlay").classList.remove("open-modal");
        },false);
        // add an eventListener  to the save button : 
        document.getElementById("btn-update-profile").addEventListener("click",()=>{
          // check changes : 
          let ToUpdate = new FormData();
          let checker = 0;
          let current_user_name = document.getElementById('UserName').value;
          let current_user_email = document.getElementById('UserEmail').value;
          let current_user_password = document.getElementById('UserPassword').value;
          if(current_user_name != origin_user_profile.get('userName')){
            if ( current_user_name.length === 0 ){
              document.getElementById('UserName').style.borderColor = "#797270";
              notify({
                message: 'all required fields must be completed',
                color: 'danger',
                timeout: 2000
              });
              return;
            }
              ToUpdate.append('UserName',current_user_name);
              document.getElementById('UserName').style.borderColor = "#eee";
              checker +=1;
          }
          if(current_user_email != origin_user_profile.get('userEmail')){
            if ( current_user_email.length === 0 ){
              document.getElementById('UserEmail').style.borderColor = "#797270";
              notify({
                message: 'all required fields must be completed',
                color: 'danger',
                timeout: 2000
              });
              return;
            }
              ToUpdate.append('UserEmail',current_user_email);
              document.getElementById('UserEmail').style.borderColor = "#eee";
              checker +=1;
          }
          if(current_user_password != origin_user_profile.get('userPassword')){
            if ( current_user_password.length === 0 ){
              document.getElementById('UserPassword').style.borderColor = "#797270";
              notify({
                message: 'all required fields must be completed',
                color: 'danger',
                timeout: 2000
              });
              return;
            }
              ToUpdate.append('UserPassword',current_user_password);
              document.getElementById('UserPassword').style.borderColor = "#eee";
              checker +=1;
          }
          if( checker === 0 ){
            notify({
              message: 'You are up to date',
              color: 'custom',
              timeout: 2000
            });
            return;
          }
          //check if the values not empty : 
          console.log(ToUpdate);
          // we have an update of data = > send put request to the backend endpoint :

          // to implement later XD ........
        },false);

      }
    });
  }
  if(DISPLAY_USER_DATA === true){
    document.querySelector(".fa-address-card").classList.remove("active-fal");
    document.querySelector(".fa-file-user").classList.add("active-fal");
    document.querySelector(".fa-credit-card").classList.remove("active-fal");
    //send get request to get the user personal details : 
    axios.defaults.baseURL = 'http://127.0.0.1:5000';
    axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
    axios.get("/Profile/Details",config)
    .then( response => {
      //check if response state is 200 : 
      if ( response.data.state === 200){
            //save the origin data : 
            origin_user_details.append('Fname',response.data.data[1].replaceAll(" ", "-"));
            origin_user_details.append('Lname',response.data.data[2].replaceAll(" ", "-"));
            origin_user_details.append('Phone',response.data.data[3].replaceAll(" ", "-"));
            origin_user_details.append('Plan',response.data.data[6].replaceAll(" ", "-")); 
            //display contnet to the target div :
            let singup_date = new Date(response.data.data[4]);
            let day = singup_date.getDay();
            let month = singup_date.getMonth();
            let year = singup_date.getFullYear();
            //document.getElementById("btn-update-profile").classList.add("Button-Update-details");
            document.querySelector(".update-form-body").innerHTML  =`
            <input type="text" id="UserFname" class="UpdateProfileName" value=${response.data.data[1].replaceAll(" ", "-")} placeholder="Ferst name"/>
            <input type="text" id="UserLname" class="UpdateProfileEmail" value=${response.data.data[2]} placeholder="Last name "/>
            <input type="phone" id="UserPhone" class="UpdateProfilePassword" value=${response.data.data[3]} placeholder="Phone"/>
            <input type="date" class="UpdateProfilePassword" value=${year+'-0'+month+'-0'+day} />
            <select  id="UserAccountPlan" class="UpdateProfilePassword">
              <option value="">${response.data.data[6].replaceAll(" ", "-")}</option>
              <option value="free trial">Free Trial</option>
              <option value="Complet edition">Complet Edition</option>
              <option value="Ultimate Edition">Ultimate Edition</option>
            </select>
            `;
            document.querySelector('.popup-btns').innerHTML = `
                <button class="Button-Update-details"> Save  </button>
                <button class="btn-cancel close-Update"> Close </button>
            `;
            document.querySelector(".close-Update").addEventListener("click",()=>{
                document.querySelector(".update-modal-overlay").classList.remove("open-modal");
            },false);
      }
      // add event listener to the send butn :
      // we have the same button with 2 eventlistner generate an beug to fix it later : 
      document.querySelector('.Button-Update-details').addEventListener("click",()=>{
        // get the current user data : 
        let checker = 0;
        let toUpdate = new FormData();
        let current_fname = document.getElementById("UserFname").value;
        let current_lname = document.getElementById("UserLname").value;
        let current_phone = document.getElementById("UserPhone").value;
        let current_plane  = document.getElementById("UserAccountPlan").value;
        // check if we have updated : 
        if( current_fname != origin_user_details.get('Fname')){
          // check if the value if empty :
          if ( current_fname.length === 0){
            // instructions : 
            document.getElementById("UserFname").style.borderColor = "#797270";
            notify({
                message: 'all required fields must be completed',
                color: 'danger',
                timeout: 2000
              });
            return;
          }
          document.getElementById("UserFname").style.borderColor = "#eee";
          toUpdate.append('Fname',current_fname);
          checker += 1;
        }
        if ( current_lname != origin_user_details.get('Lname') ){
          if( current_lname.length === 0){
            document.getElementById("UserLname").style.borderColor = "#797270";
            notify({
                message: 'all required fields must be completed',
                color: 'danger',
                timeout: 2000
              });
            return;
          }
          document.getElementById("UserLname").style.borderColor = "#eee";
          toUpdate.append('Lname',current_lname);
          checker += 1;
        }
        if ( current_phone != origin_user_details.get('Phone') ){
          if( current_phone.length === 0){
            document.getElementById("UserPhone").style.borderColor = "#797270";
            notify({
                message: 'all required fields must be completed',
                color: 'danger',
                timeout: 2000
              });
            return;
          }
            document.getElementById("UserPhone").style.borderColor = "#eee";
            toUpdate.append('Phone',current_phone);
            checker += 1;
        }
        // ignore update user plan for the moment XD .......
        // check checker value :
        if( checker === 0 ){
            notify({
              message: 'You are up to date',
              color: 'custom',
              timeout: 2000
            });
            return;
          }
          //check if the values not empty : 
          console.log(toUpdate);
          // we have an update of data = > send put request to the backend endpoint :
          // to implement later XD ........

      },false);
    })
  }
  if(DISPLAY_USER_CREDIT_CARD === true){
    document.querySelector(".fa-address-card").classList.remove("active-fal");
    document.querySelector(".fa-file-user").classList.remove("active-fal");
    document.querySelector(".fa-credit-card").classList.add("active-fal");
    // send a get request to get user payment details : 
    axios.defaults.baseURL = 'http://127.0.0.1:5000';
    axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
    axios.get("/Profile/Credit",config)
    .then( response => {
      // check if user already have an payment details : 
      if( response.data.data.length === 0){
        document.querySelector(".update-form-body").innerHTML = `
            <input type="text" class="UpdateProfileName" placeholder="Card name"/>
            <input type="text" class="UpdateProfileEmail" placeholder="Card number "/>
            <input type="date" class="UpdateProfilePassword" placeholder="Card Date"/>
            <input type="text" class="UpdateProfilePassword" placeholder="Card CVC"/>
        `;
      }
      else{
        //save the origin credit info : 
        origin_user_credit.append('CardName',response.data.data[1].replaceAll(' ','-'));
        origin_user_credit.append('CardNumber',response.data.data[2].replaceAll(" ","-"));
        origin_user_credit.append('CardCvc',response.data.data[4]);
        
        document.querySelector(".update-form-body").innerHTML  =`
            <input type="text" class="UpdateProfileName" id="cardName" value=${response.data.data[1].replaceAll(" ","-")} placeholder="Card name"/>
            <input type="text" class="UpdateProfileEmail" id="cardNumber" value=${response.data.data[2].replaceAll(" ","-")} placeholder="Card number "/>
            <input type="date" class="UpdateProfilePassword" id="cardDate" value=${response.data.data[3]} placeholder="Card Date"/>
            <input type="text" class="UpdateProfilePassword" id="cardCvc" value=${response.data.data[4]} placeholder="Card CVC"/>
        `;
      }
      document.querySelector('.popup-btns').innerHTML = `
          <button class="Button-Update-credit"> Save  </button>
          <button class="btn-cancel close-Update"> Close </button>
      `;
      document.querySelector(".close-Update").addEventListener("click",()=>{
           document.querySelector(".update-modal-overlay").classList.remove("open-modal");
      },false);
      document.querySelector('.Button-Update-credit').addEventListener('click',()=>{
        let checker = 0;
        let toUpdate = new FormData();
        let current_card_name = document.getElementById("cardName").value;
        let current_card_number =  document.getElementById("cardNumber").value;
        //let current_card_date =  document.getElementById("cardDate").value;
        let current_card_cvc =  document.getElementById("cardCvc").value;
        // check the current updated values :
        if ( current_card_name != origin_user_credit.get('CardName')){
          // check if the updated value is it empty : 
          if ( current_card_name.length === 0 ){
            document.getElementById("cardName").style.borderColor = "#797270";
            notify({
                message: 'all required fields must be completed',
                color: 'danger',
                timeout: 2000
              });
            return;
          }
          document.getElementById("cardName").style.borderColor = "#eee";
          toUpdate.append('CardName',current_card_name);
          checker +=1;
        }
        if ( current_card_number != origin_user_credit.get('CardNumber')){
          // check if the updated value is it empty : 
          if ( current_card_number.length === 0 ){
            document.getElementById("cardNumber").style.borderColor = "#797270";
            notify({
                message: 'all required fields must be completed',
                color: 'danger',
                timeout: 2000
              });
            return;
          }
          document.getElementById("cardNumber").style.borderColor = "#eee";
          toUpdate.append('CardName', current_card_number);
          checker +=1;
        }
        if ( current_card_cvc != origin_user_credit.get('CardCvc') ) {
          if ( current_card_cvc.length === 0){
            document.getElementById("cardCvc").style.borderColor = "#797270";
            notify({
                message: 'all required fields must be completed',
                color: 'danger',
                timeout: 2000
              });
            return;
          }
          document.getElementById("cardCvc").style.borderColor = "#eee";
          toUpdate.append('CardCvc',current_card_cvc);
          checker += 1;
        }
        // check the value of checker : 
        if ( checker === 0 ){
          notify({
              message: 'You are up to date',
              color: 'custom',
              timeout: 2000
            });
            return;
        }
      },false);
    })
    
  }
}



function displayUserUploadForm(){
  // display an formular : 
  document.querySelector(".upload-modal-overlay").classList.add('open-modal');
  // get the close button : 
  document.querySelector('#btn-close-upload').addEventListener("click",()=>{
    document.querySelector(".upload-modal-overlay").classList.remove('open-modal');
  },false);
  document.querySelector(".btn-cancel-upload").addEventListener("click",()=>{
    document.querySelector(".upload-modal-overlay").classList.remove('open-modal');
  },false);

  // add evenet listner to the uplad btn : 
  document.querySelector('.btn-upload').addEventListener("click",()=>{
    // check if the input is no epty : 
    let current_file = document.getElementById('file_to_upload').files[0];
    console.log(current_file);
    if ( current_file.length === 0 )
    {
      // empty data sended : 
      notify({
            message: " You will not be able to load the empty path.",
            color: 'custom',
            timeout: 2500
      });
    }else{
      // file successfuly getet : 
      // step2  : send the current file to the backend api router handler :
      let data_frame = new FormData();
      data_frame.append('file',current_file);
      axios.defaults.baseURL = 'http://127.0.0.1:5000';
      axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
      axios.post('/Upload/File',data_frame,config)
      .then( response => {
        console.log(" response geted :)    ")
       })
      .catch(error => {
        console.error(error);
      });
    }
  },false);  
}




let loading = false;
//let my_session = sessionStorage;

setInterval(()=>{
  if(loading){
    getAllFolders();
    loading = false;
  }
},1000)

getAllFolders();


var config = {};
config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
};


// global switch buttons : 

let DISPLAY_USER_PROFILE = true;
let DISPLAY_USER_DATA = false;
let DISPLAY_USER_CREDIT_CARD = false;



// global folders list :


let FOLDER_LIST = []; 
const btn_add_folder = document.getElementById("create_new_folder");
btn_add_folder.addEventListener("click",create_folder,false);

// all folder services :
const btn_close_add_folder = document.querySelector(".btn-close");
btn_close_add_folder.addEventListener("click",close_add_folder,false);


const btn_cancel_add_folder = document.querySelector(".btn-cancel");
btn_cancel_add_folder.addEventListener("click",close_add_folder,false);

const btn_new_folder = document.querySelector(".btn-send");
btn_new_folder.addEventListener("click",insertNewFolder,false);


const btn_user_upload_data_file = document.getElementById("btn_upload_file");
// add event listner : 
btn_user_upload_data_file.addEventListener("click",displayUserUploadForm,false);


// user settings and profile : 

const btn_display_profile = document.getElementById("btn-show-user-profile");

btn_display_profile.addEventListener("click",display_user_profile,false);
