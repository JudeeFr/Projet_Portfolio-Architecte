
// bouton Logout 
const logout = document.querySelector(".logout")

logout.addEventListener("click",()=> {
    window.location.replace("index.html")
});

/* Dupliquer la galerie dans la modale */
let worksDual;

function duplicateGallery() {
    return fetch("http://localhost:5678/api/works")
        .then((r)=> {if (r.ok) {return r.json()}
            else {throw new Error('Il y a une erreur')}
        })
        .then((works)=> {worksDual = works;
            return worksDual;
        });
}

// boutons open & close modal
const closeBtn = document.querySelector('.close-modal');
let modal = null;

const openModal = function(e) {
    e.preventDefault();
    const target = document.getElementById("modal1");
    target.style.display = null;
    target.setAttribute('aria-hidden', false);
    target.setAttribute('aria-modal', true);
    modal = target;
    modal.addEventListener('click', closeModal);
    modal.querySelector('.js-stop-modal').addEventListener('click', stopPropagation);
    modal.querySelector('.js-stop-modal2').addEventListener('click', stopPropagation);
    closeBtn.addEventListener('click', closeModal)
}
const closeModal = function(e) {
    e.preventDefault();
    if (modal === null) return
    modal.style.display = "none";
    modal.setAttribute('aria-hidden', true);
    modal.setAttribute('aria-modal', false);
    modal.removeEventListener('click', closeModal);
    modal.querySelector('.js-stop-modal').removeEventListener('click', stopPropagation);
    modal.querySelector('.js-stop-modal2').removeEventListener('click', stopPropagation);
    closeBtn.removeEventListener('click', closeModal);
    modal = null;
}
const stopPropagation = function (e) {
    e.stopPropagation()
};

document.querySelectorAll('.js-modal').forEach(a => {
    a.addEventListener('click', openModal);   
})

// Afficher la gallerie dans la modale
const modalGallery = document.querySelector(".modal-gallery");
let editMode = false;
let token = window.sessionStorage.getItem("token") || "";
const modale = document.getElementById("#modal1");

function modal1(works) {
    /* afficher les images dans la modale */
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

        /* boutons éditer et supprimer */
        let editButton = document.createElement("button");
        editButton.innerHTML = "éditer";
        editButton.classList.add("btn-edit");

        let trashButton = document.createElement("i");
        trashButton.classList.add("fa-solid", "fa-trash-can", "trash-can-button");
        trashButton.style.display = "none";

        let dragButton = document.createElement("i");
        dragButton.classList.add("fa-solid", "fa-up-down-left-right");
        dragButton.style.display = "none";

        figure.appendChild(editButton);
        figure.appendChild(trashButton);
        figure.appendChild(dragButton);

        editButton.addEventListener("click", function () {
            editMode = !editMode;
            if (editMode) {
                editButton.innerHTML = "enregistrer";
                trashButton.style.display = "block";
                dragButton.style.display = "block";
            }
            else {
                editButton.innerHTML = "éditer";
                trashButton.style.display = "none";
                dragButton.style.display = "none";
            }
        })
        
        trashButton.addEventListener("click", function () {
            let id = this.parentNode.getAttribute("data-id");
            
            fetch(`http://localhost:5678/api/works/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },  
            })
            .then(function (r) {
                if (r.status === 204) {
                    figure.remove();
                    figure.innerHTML = "";
                    /* supprimer l'image dans la modale et la gallerie */
                    duplicateGallery().then(function (works) {                       
                        modale.innerHTML = "";
                        modalGallery.innerHTML = "";
                        modal1(works);  
                    });
                }else {console.error("Il y a une erreur")}
                })
            .catch(function (error) {console.error("Il y a une erreur:", error)});
        });
    } 
} 
duplicateGallery().then((works)=>{modal1(works)});


/* boutton supprimer la gallerie */
const deleteGalleryButton = document.querySelector(".delete-gallery");
const id = document.querySelector(".container1").getAttribute("data-id");

function deleteGallery() {
    const figure = document.querySelectorAll(".modal-gallery");
    figure.forEach(figure => {
        let id = figure.getAttribute("data-id");
        fetch(`http://localhost:5678/api/works/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            
        })
        .then(function (r) {
            if (r.ok) {deleteGallery()}
            else {console.error("Il y a une erreur")}
        })
        .catch(function (error) {
            console.error("Il y a une erreur:", error);
        });
    });
    /* supprimer la gallerie dans la modale et le portfolio */
    duplicateGallery().then(function (works) {
        modale.innerHTML = "";
        modalGallery.innerHTML = "";
        modal1(works);
    });
}
deleteGalleryButton.addEventListener("click", deleteGallery);

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

/* Afficher categories dans formulaire*/
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

// bouton Ajouter une photo 
const background = document.querySelector(".background");
const img = document.createElement("img");
const errorMessage = document.querySelector("#error-message");
const uploadPhoto = document.querySelector(".upload-photo");
let image;

uploadPhoto.addEventListener("click", function () {
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
        reader.onload = () => {
            img.src = reader.result;
            img.style.width = "30%";
            background.appendChild(img);
        }
    }
    );
});

// Ajout nouvelle image sans recharger la page
function newImageShow() {
    return fetch("http://localhost:5678/api/works")
        .then((r)=> {if (r.ok) {return response.json()}
            else {throw new Error('Il y a une erreur')}
        })
        .then(function (works) {return works});
}
// Btn valider - Envoie de l'image au serveur
const submitButton = document.querySelector("#submit-button");
const titleInput = document.querySelector("#title");
const categorySelect = document.querySelector("#category");

submitButton.addEventListener("click", function (e) {
    e.preventDefault();
    const title = titleInput.value;
    const category = categorySelect.value;
    console.log(image);

    if (!image) {errorMessage.innerHTML = "Une image est requise";
        return;
    }
    if (!title) {errorMessage.innerHTML = "Un titre est requis";
        return;
    }
    if (!category) {errorMessage.innerHTML = "Une catégorie est obligatoire";}
    
    const formData = new FormData();
    formData.append("title", title);
    formData.append("category", category);
    formData.append("image", image);

    fetch("http://localhost:5678/api/works", {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: formData
    })
    .then( (r) => {if (r.ok) {return r.json()}
        else {console.error("Il y a une erreur");}
    })
    /* ajouter la nouvelle image dans la modale et dans la galerie */    
    .then (function(data){console.log(data);
        // newImageShow().then(function (works) {
        //     modale.innerHTML = "";
        //     modalGallery.innerHTML = "";
        //     modal1(works);
        //    });
    })
    .catch(function (error) {console.error("Il y a une erreur:", error);});
});


// bouton publier les changements 
const publish = document.querySelector(".publish");

publish.addEventListener("click", function (e) {
    e.preventDefault();
    editMode = !editMode;
    if (editMode) {
        publish.innerHTML = "Changements enregistrés";
        fetch("http://localhost:5678/api/works").then(function (works) {
            duplicateGallery(works);
        });
    }
});