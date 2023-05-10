
// Logout 
const logout = document.querySelector(".logout")

logout.addEventListener("click",()=>{
    window.location.replace("index.html")
});

/* Dupliquer la galerie dans la modale */
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
// Afficher la gallerie dans la modale
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


/* Appel duplicateGallery dans la modale */
duplicateGallery().then(function (works) {  
    modal1(works);
});

// boutons modifier 
const closeBtn = document.querySelector('.close-modal');

const openModal = function(e) {
    e.preventDefault();
    modal.style.display = null;
    modal.setAttribute('aria-hidden', false);
    modal.setAttribute('aria-modal', true);
    closeBtn.addEventListener('click', closeModal)
}

const closeModal = function(e) {
    e.preventDefault();
    modal.style.display = "none";
    modal.setAttribute('aria-hidden', true);
    modal.setAttribute('aria-modal', false);
    closeBtn.removeEventListener('click', closeModal)
}

document.querySelectorAll('.js-modal').forEach(a => {
    a.addEventListener('click', openModal);   
})

// Affichage formulaire ajout photo
const addPhotoBtn = document.querySelector('.add-photo-btn');
const modalWrapper = document.querySelector('.modal-wrapper');
const modalForm = document.querySelector('.modal-form');
const returnBtn = document.querySelector('.return-btn');


const addPhoto = function(e) {
    e.preventDefault();
    modalWrapper.style.display = "none";
    modalForm.style.display = null;
    returnBtn.addEventListener('click', returnModal); 
}
const returnModal = function(e) {
    e.preventDefault();
    modalWrapper.style.display = null;
    modalForm.style.display = "none";
    returnBtn.removeEventListener('click', returnModal)
}
addPhotoBtn.addEventListener('click', addPhoto);   

/* Afficher categories*/
async function categories() {
    const response = await fetch("http://localhost:5678/api/categories");
    const categories = await response.json();
    const select = document.querySelector("#category");
    for (let i = 0; i < categories.length; i++) {
        let option = document.createElement("option");
        option.value = categories[i].id;
        option.innerHTML = categories[i].name;
        select.appendChild(option);
    }
}
categories();

// Ajouter une photo 
const background = document.querySelector(".background");
const img = document.createElement("img");
const errorMessage = document.querySelector("#error-message")
let imgSrc;
let image;

document.querySelector(".add-photo").addEventListener("click", function () {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/jpg, image/png,image/jPEG";
    input.click();
    /* choix fichier */
    input.addEventListener("change", async function () {
        image = input.files[0];
        if (image.type !== "image/jpg" && image.type !== "image/png" && image.type !== "image/jpeg") {
            errorMessage.innerHTML = "jpg ou png obligatoire";
            return;
        }
        if (image.size > 4 * 1024 * 1024) {
            errorMessage.innerHTML = "4 mo maximum";
            return;
        }
        /* Remplacer background par image chargée */
        background.innerHTML = "";
        const reader = new FileReader();
        reader.readAsDataURL(image);
        reader.onload = function () {
            img.src = reader.result;
            imgSrc = reader.result;
            img.style.width = "30%";
            background.appendChild(img);
        }
    }
    );
});

/* afficher une nouvelle image sans recharger la page*/
const newImageShow = () => {
    return fetch("http://localhost:5678/api/works")
        .then(function (response) {
            if (response.ok) {
                return response.json();
            }else {
                throw new Error('Il y a une erreur');
            }
        })
        .then(function (works) {
            return works;
        });
}
// Envoie de l'image au serveur 
async function fetchWorks() {
    
    const formData = new FormData();
    
    formData.append("title", title);
    formData.append("category", category);
    formData.append("image", image);
    try {
        const r = await fetch("http://localhost:5678/api/works", {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-type": "application/json",
            },
            body: formData
            
        })   
        if (r.ok===true) {
            return r.json();
        }else {
            errorMessage.innerHTML = "Impossible de contacter le serveur";
            return;
        }
        /* ajouter la nouvelle image dans la modale et dans la galerie */
//     
//      newImageShow().then(function (works) {
//          modal.innerHTML = "";
//          modalGallery.innerHTML = "";
//              modal1(works);
//         });
//     })
    } catch (err) {
        console.log(err);
    }
}
const submitButton = document.querySelector("#submit-button");
const titleInput = document.querySelector("#title");
const categorySelect = document.querySelector("#category");

submitButton.addEventListener("click", function (event) {
    event.preventDefault();
    const title = titleInput.value;
    const category = categorySelect.value;
    console.log(image);
    if (!image) {
        errorMessage.innerHTML = "Une image est requise";
        return;
    }
    if (!title) {
        errorMessage.innerHTML = "Un titre est requis";
        return;
    }
    if (!category) {
        errorMessage.innerHTML = "Une catégorie est requise";
    }   
    fetchWorks()    
});

// publier les changements 
let editMode = false;
const publish = document.querySelector(".publish");

publish.addEventListener("click", function (e) {
    e.preventDefault();
    editMode = !editMode;
    if (editMode) {
        publish.innerHTML = "Enregistré";
        fetch("http://localhost:5678/api/works").then(function (works) {
            duplicateGallery(works);
        });
    }
});