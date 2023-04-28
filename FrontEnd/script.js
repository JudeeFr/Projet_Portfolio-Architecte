const gallery = document.querySelector(".gallery");

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
.then(response => response.json())
.then(json => {createElements(json)});




function newFunction(div) {
    div += '</figure>';
    return div;
}

