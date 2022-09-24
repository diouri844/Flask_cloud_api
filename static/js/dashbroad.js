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
  console.log("create folder fired clicked ");
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
      // add some html : 
      header_div.innerHTML = `
        <h4 class="opened-folder_name"><i class="fas fa-folder-open"></i> ${ current_folder.Name } </h4>
        <button type="button" class="btn-close close-opened-folder" aria-label="Close"></button>
      `;
      body_div.innerHTML = `
      <div class="opened-folder-details">
          <h6><i class="fas fa-clock"></i> ${ current_folder.CreateAt } </h6>
          <h6 type="button" class="folder-services" data-bs-toggle="tooltip" data-bs-placement="top" title="find">
              <input class="sub-search-input" type="text" placeholder="Search" >
              <i class="fas fa-search"></i>
              </h6>
          <h6 type="button" class="folder-services" data-bs-toggle="tooltip" data-bs-placement="top" title="add folder">
  				    <i class="fas fa-folder-plus"></i>
			    </h6>
          <h6 type="button" class="folder-services" data-bs-toggle="tooltip" data-bs-placement="top" title="remove folder">
  				    <i class="fas fa-folder-minus"></i>
			    </h6>
          <h6 type="button" class="folder-services" data-bs-toggle="tooltip" data-bs-placement="top" title="sort by">
  				    <i class="fas fa-bars"></i>
			    </h6>
      </div>
      `;
      // manage the close button : 
      const btn_close = document.querySelector(".close-opened-folder");
      btn_close.addEventListener("click",()=>{
        target.classList.remove("open-modal");
      },false);



    },false);



    btn_delete_current_folder.addEventListener("click", (event)=>{
      console.log(" delete : ",event.path[1].id);
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

