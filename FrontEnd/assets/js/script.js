const gallery = document.querySelector(".gallery");
const portfolio = document.getElementById("portfolio");

const buttonObjets = document.getElementById("Objets");
const buttonAppartements = document.getElementById("Appartements");
const buttonHR = document.getElementById("HR");
const buttonAll = document.getElementById("Tout");

let works = [];

function portfolioFilter(works) {
    let gallery = document.querySelector('.gallery');
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
};

fetch('http://localhost:5678/api/works')
.then(function (response) {
    if (response.ok) {
        return response.json();
    }
    else {
        throw new Error('Erreur réponse de l\'API');
    }
})
.then(function (response) {
    works = response;
    for (let i = 0; i < works.length; i++) {
        let work = works[i];
        let figure = document.createElement("figure");
        
        let img = document.createElement("img");
        img.src = work.imageUrl;
        img.crossOrigin = "anonymous";
        figure.appendChild(img);
        
        let figcaption = document.createElement("figcaption");
        figcaption.innerHTML = work.title;
        figure.appendChild(figcaption);

        gallery.appendChild(figure);    
    };
    
    buttonObjets.addEventListener("click", function(){  
        const Objets = works.filter((works) => {return works.categoryId === 1;} );  
        portfolioFilter(Objets);
    })
    buttonAppartements.addEventListener("click", function(){  
        const Appartements = works.filter((works) => {return works.categoryId === 2;} );  
        portfolioFilter(Appartements);
    })
    buttonHR.addEventListener("click", function(){  
        const HR = works.filter((works) => {return works.categoryId === 3;} );  
        portfolioFilter(HR);
    })
    buttonAll.addEventListener("click", function(){  
        const All = works.filter((works) => {return works;} );  
        portfolioFilter(All);
    })
})


