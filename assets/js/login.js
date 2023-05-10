
// Login 
const submit = document.getElementById("submit");
const error = document.getElementById("error");

submit.addEventListener("click", (e) => {
    e.preventDefault();
    const email = document.getElementById("emailUser").value;
    const password = document.getElementById("password").value;
   
    if (!email || !password) {
        error.innerHTML = "E-mail ou un mot de passe invalide";
        return;
   } else {
        fetch("http://localhost:5678/api/users/login", {
            method: "POST",
            headers: {
                accept: "application/json",
                "Content-type": "application/json",
            },
            body: JSON.stringify({email: email, password: password}),
        })
        .then( (r) => {    
            if (r.ok) {
                return r.json();
            } else {
                error.innerHTML = "Erreur dans l'identifiant ou le mot de passe";
            }
        })
        
        .then(function (userInformation) {              
            if (userInformation) {
                window.sessionStorage.setItem("userInformation", JSON.stringify(userInformation));
                window.sessionStorage.setItem("token", userInformation.token);
                window.location.replace("./admin.html");
            }
        })
        .catch(error => console.error(error))
    }
        
});
