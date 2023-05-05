
// Logout 
const logout = document.querySelector(".logout")

logout.addEventListener("click",()=>{
    window.location.replace("index.html")
});

/* function worksDual to duplicate in modal the gallery */
let worksDual;

const duplicateGallery = () => {
    return fetch("http://localhost:5678/api/works")
        .then(function (response) {
            if (response.ok) {
                return response.json();
            }
            else {
                throw new Error('Il y a une erreur');
            }
        })
        .then(function (works) {
            worksDual = works;
            return worksDual;
        });
}
// Affichage gallerie dans la modale
const modal = document.getElementById("modal1");
const modalGallery = document.querySelector(".modal-gallery");

const modal1 = (works) => {
    for (let i = 0; i < works.length; i++) {
        let work = works[i];
        let img = document.createElement("img");
        let galleryModal = document.createElement("div");
        img.crossOrigin = "anonymous";
        img.src = work.imageUrl;
        img.classList.add("img");
        let figure = document.createElement("figure");
        galleryModal.appendChild(figure);
        figure.appendChild(img);
        modalGallery.appendChild(galleryModal);
        figure.classList.add("modal-gallery");
        figure.setAttribute("data-id", work.id);
           
}};



duplicateGallery().then(function (works) {  
    modal1(works);
});