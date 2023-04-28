const gallery = document.querySelector(".gallery");
const portfolio = document.getElementById("#portfolio");



function createElements(works) {      
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
.then(function (works) {
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
    }
});


