// selecte elements to working with :

const btn = document.querySelector(".nav-toggle");
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



btn.addEventListener("click", function(){
  /*if(links.classList.contains("show-links")){
    //remove it :
    links.classList.remove("show-links");
  }
  else{
    links.classList.add("show-links");
  }*/
  links.classList.toggle("show-links");
});
