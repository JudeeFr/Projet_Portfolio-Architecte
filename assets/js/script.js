const gallery = document.querySelector('.gallery');
const portfolio = document.getElementById('portfolio');

const buttonObjets = document.getElementById('Objets');
const buttonAppartements = document.getElementById('Appartements');
const buttonHR = document.getElementById('HR');
const buttonAll = document.getElementById('Tout');

// Filtres
function portfolioFilter(works) {
	gallery.innerHTML = '';
	for (let key in works) {
		let figure = document.createElement('figure');
		gallery.appendChild(figure);
		let img = document.createElement('img');
		img.src = works[key].imageUrl;
		figure.appendChild(img);
		img.crossOrigin = 'anonymous';
		let figcaption = document.createElement('figcaption');
		figcaption.innerHTML = works[key].title;
		figure.appendChild(figcaption);
	}
}
// Affichage projets

fetch('http://localhost:5678/api/works')
	.then(function (r) {
		if (r.ok) {
			return r.json();
		} else {
			throw new Error("Erreur réponse de l'API");
		}
	})
	.then(function (works) {
		works.forEach((work) => {
			let figure = document.createElement('figure');
			let img = document.createElement('img');
			img.src = work.imageUrl;
			img.crossOrigin = 'anonymous';
			figure.appendChild(img);
			let figcaption = document.createElement('figcaption');
			figcaption.innerHTML = work.title;
			figure.appendChild(figcaption);
			gallery.appendChild(figure);
		});
		// Boutons filtres
		buttonObjets.addEventListener('click', function () {
			const Objets = works.filter((works) => {
				return works.categoryId === 1;
			});
			portfolioFilter(Objets);
		});
		buttonAppartements.addEventListener('click', function () {
			const Appartements = works.filter((works) => {
				return works.categoryId === 2;
			});
			portfolioFilter(Appartements);
		});
		buttonHR.addEventListener('click', function () {
			const HR = works.filter((works) => {
				return works.categoryId === 3;
			});
			portfolioFilter(HR);
		});
		buttonAll.addEventListener('click', function () {
			const All = works.filter((works) => {
				return works;
			});
			portfolioFilter(All);
		});
	});
