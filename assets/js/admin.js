// bouton Logout
const logout = document.querySelector('.logout');
let token = window.sessionStorage.getItem('token') || '';

logout.addEventListener('click', () => {
	window.sessionStorage.removeItem('token', token);
	window.location.replace('index.html');
});

/* Dupliquer l'appel API de works sur la page admin */
let worksDual;

function duplicateWorks() {
	return fetch('http://localhost:5678/api/works')
		.then((r) => {
			if (r.ok) {
				return r.json();
			} else {
				throw new Error('Il y a une erreur');
			}
		})
		.then((works) => {
			worksDual = works;
			return worksDual;
		});
}

// dupliquer l'affichage de la galerie dans la page admin
const gallery = document.querySelector('.gallery');
const portfolio = document.getElementById('portfolio');

function duplicatePortfolio(works) {
	works.forEach((work) => {
		if (work && work.hasOwnProperty('title')) {
			const figure = document.createElement('figure');

			figure.setAttribute('data-id', work.id);
			figure.setAttribute('data-user-id', work.userId);

			const img = document.createElement('img');
			img.src = work.imageUrl;
			img.crossOrigin = 'anonymous';
			figure.appendChild(img);

			const figcaption = document.createElement('figcaption');
			figcaption.innerHTML = work.title;
			figure.appendChild(figcaption);
			gallery.appendChild(figure);
		}
	});
}
// boutons open & close de la modale
const closeBtn = document.querySelectorAll('.close-modal');
let modal = null;
const jsModal = document.querySelector('.js-stop-modal');

const openModal = function (e) {
	e.preventDefault();
	const target = document.getElementById('modal1');
	target.style.display = null;
	target.setAttribute('aria-hidden', false);
	target.setAttribute('aria-modal', true);
	modal = target;
	modal.addEventListener('click', closeModal);
	jsModal.addEventListener('click', stopPropagation);
	closeBtn.forEach((a) => {
		a.addEventListener('click', closeModal);
	});
};
const closeModal = function (e) {
	e.preventDefault();
	if (modal === null) return;
	modal.style.display = 'none';
	modal.setAttribute('aria-hidden', true);
	modal.setAttribute('aria-modal', false);
	modal.removeEventListener('click', closeModal);
	jsModal.removeEventListener('click', stopPropagation);
	closeBtn.forEach((a) => {
		a.removeEventListener('click', closeModal);
	});
	modal = null;
};
const stopPropagation = function (e) {
	e.stopPropagation();
};

document.querySelectorAll('.js-modal').forEach((a) => {
	a.addEventListener('click', openModal);
});

// Afficher la gallerie dans la modale
const modalGallery = document.querySelector('.modal-gallery');
let editMode = false;
const modale = document.getElementById('modal1');

function trash() {
	const figure = document.querySelector('.figure-image');
	let id = figure.getAttribute('data-id');

	fetch(`http://localhost:5678/api/works/${id}`, {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
		body: null,
	})
		.then(function (r) {
			if (r.status === 204) {
				figure.remove();
				figure.innerHTML = '';
			} else {
				console.error('Il y a une erreur');
			}
		})
		/* supprimer l'image dans la modale et la gallerie */
		.then(function (data) {
			console.log(data);
			duplicateWorks().then(function (works) {
				modalGallery.innerHTML = '';
				gallery.innerHTML = '';
				showGalleryOnModal(works);
				duplicatePortfolio(works);
			});
		})
		.catch(function (error) {
			console.error('Il y a une erreur:', error);
		});
}

function editImage() {
	let figure = document.querySelectorAll('.figure-image');
	const editButton = document.createElement('div');
	editButton.innerHTML = 'éditer';
	editButton.classList.add('btn-edit');

	const dragButton = document.createElement('i');
	dragButton.classList.add('fa-solid', 'fa-up-down-left-right');
	dragButton.style.display = 'none';

	const trashButton = document.createElement('i');
	trashButton.classList.add('fa-solid', 'fa-trash-can', 'trash-can-button');
	trashButton.style.display = 'none';

	function createBtn(figures) {
		figures.forEach((figure) => {
			figure.append(editButton, dragButton, trashButton);
		});
	}
	createBtn(figure);

	editButton.addEventListener('click', function () {
		editMode = !editMode;
		if (editMode) {
			editButton.innerHTML = 'enregistrer';
			dragButton.style.display = 'block';
			trashButton.style.display = 'block';
		} else {
			editButton.innerHTML = 'éditer';
			dragButton.style.display = 'none';
			trashButton.style.display = 'none';
		}
	});

	trashButton.addEventListener('click', function () {
		trash();
	});
}

function showGalleryOnModal(works) {
	works.forEach((work) => {
		let img = document.createElement('img');
		img.crossOrigin = 'anonymous';
		img.src = work.imageUrl;
		img.classList.add('img');

		let figure = document.createElement('figure');
		figure.classList.add('figure-image');
		figure.setAttribute('data-id', work.id);
		modalGallery.appendChild(figure);

		figure.appendChild(img);
		editImage();
	});
}

/* afficher les images dans la modale et page admin */
duplicateWorks().then((works) => {
	showGalleryOnModal(works);
	duplicatePortfolio(works);
});

/* boutton supprimer la galerie */
const deleteGalleryBtn = document.querySelector('.delete-gallery');
const id = document.querySelector('.container1').getAttribute('data-id');

function confirmer() {
	const dialog = confirm('Voulez-vous vraiment supprimer la gallerie ?');
	if (dialog) {
		deleteAll();
	}
}

function deleteAll() {
	const figure = document.querySelectorAll('.figure-image');
	figure.forEach((figure) => {
		let id = figure.getAttribute('data-id');
		fetch(`http://localhost:5678/api/works/${id}`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
		})
			.then(function (r) {
				if (r.status === 204) {
					deleteAll();
				} else {
					console.error('Il y a une erreur');
				}
			})

			.catch(function (error) {
				console.error('Il y a une erreur:', error);
			});
	});
	duplicateWorks().then(function (works) {
		modalGallery.innerHTML = '';
		gallery.innerHTML = '';
		showGalleryOnModal(works);
		duplicatePortfolio(works);
	});
}

deleteGalleryBtn.addEventListener('click', function () {
	confirmer();
});

// Affichage formulaire ajout photo dans la modale
const addPhotoBtn = document.querySelector('.add-photo-btn');
const modalWrapper = document.querySelector('.modal-wrapper');
const modalForm = document.querySelector('.modal-form');
const returnBtn = document.querySelector('.return-btn');

const addPhoto = function (e) {
	e.preventDefault();
	modalWrapper.style.display = 'none';
	modalForm.style.display = null;
	returnBtn.addEventListener('click', returnModal);
};
const returnModal = function (e) {
	e.preventDefault();
	modalWrapper.style.display = null;
	modalForm.style.display = 'none';
	returnBtn.removeEventListener('click', returnModal);
};
addPhotoBtn.addEventListener('click', addPhoto);

/* Afficher les categories dans le formulaire*/
async function categories() {
	const response = await fetch('http://localhost:5678/api/categories');
	const categories = await response.json();
	const select = document.querySelector('#category');
	for (let i = 0; i < categories.length; i++) {
		let option = document.createElement('option');
		option.value = categories[i].id;
		option.innerHTML = categories[i].name;
		select.appendChild(option);
	}
}
categories();

// bouton Ajouter une photo
const bcg = document.querySelector('.background');
const bcgImg = document.querySelector('.background-img');
const img = document.createElement('img');
const errorMessage = document.querySelector('#error-message');
const uploadPhoto = document.querySelector('.upload-photo');
let image;

uploadPhoto.addEventListener('click', function () {
	const input = document.createElement('input');
	input.type = 'file';
	input.accept = 'image/jpg, image/png,image/jPEG';
	input.click();
	/* choix fichier */
	input.addEventListener('change', async function () {
		image = input.files[0];
		if (
			image.type !== 'image/jpg' &&
			image.type !== 'image/png' &&
			image.type !== 'image/jpeg'
		) {
			errorMessage.innerHTML = 'jpg ou png obligatoire';
			return;
		}
		if (image.size > 4 * 1024 * 1024) {
			errorMessage.innerHTML = '4 mo maximum';
			return;
		}
		/* Remplacer background par image chargée */
		bcg.style.display = 'none';
		bcgImg.style.display = null;
		const reader = new FileReader();
		reader.readAsDataURL(image);
		reader.onload = () => {
			img.src = reader.result;
			img.style.width = '30%';
			bcgImg.appendChild(img);
		};
	});
});

// Ajout nouvelle image sans recharger la page
function newImageShow() {
	return fetch('http://localhost:5678/api/works')
		.then((r) => {
			if (r.ok) {
				return r.json();
			} else {
				throw new Error('Il y a une erreur');
			}
		})
		.then(function (works) {
			return works;
		});
}

// Btn valider - Envoie de l'image au serveur
const submitButton = document.querySelector('#submit-button');
const titleInput = document.querySelector('#title');
const categorySelect = document.querySelector('#category');

submitButton.addEventListener('click', function (e) {
	e.preventDefault();
	const title = titleInput.value;
	const category = categorySelect.value;
	console.log(image);

	if (!image) {
		errorMessage.innerHTML = '*Image obligatoire*';
		return;
	}
	if (!title) {
		errorMessage.innerHTML = '*Titre obligatoire*';
		return;
	}
	if (!category) {
		errorMessage.innerHTML = '*Catégori obligatoire*';
	}

	const formData = new FormData();
	formData.append('title', title);
	formData.append('category', category);
	formData.append('image', image);

	fetch('http://localhost:5678/api/works', {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			Authorization: `Bearer ${token}`,
		},
		body: formData,
	})
		.then((r) => {
			if (r.ok) {
				return r.json();
			} else {
				console.error('Il y a une erreur');
			}
		})
		/* ajouter la nouvelle image dans la modale et dans la galerie */
		.then(function (data) {
			console.log(data);
			alert('Photo ajoutée à la galerie');
			bcg.style.display = null;
			bcgImg.style.display = 'none';
			duplicateWorks().then(function (works) {
				modalGallery.innerHTML = '';
				gallery.innerHTML = '';
				showGalleryOnModal(works);
				duplicatePortfolio(works);
			});
		})
		.catch(function (error) {
			console.error('Il y a une erreur:', error);
		});
});

// bouton publier les changements
const publish = document.querySelector('.publish');

publish.addEventListener('click', function (e) {
	e.preventDefault();
	editMode = !editMode;
	if (editMode) {
		publish.innerHTML = 'Changements publiés';
		fetch('http://localhost:5678/api/works').then(function (works) {
			duplicatePortfolio(works);
			window.location.reload();
		});
	}
});
