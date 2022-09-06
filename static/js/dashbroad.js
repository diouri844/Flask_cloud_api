// selecte elements to working with :

const btn = document.querySelector(".nav-toggle");
const links = document.querySelector(".links");

// add eventListener to button :

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
