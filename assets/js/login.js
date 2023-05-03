const submit = document.getElementById("submit");
const errorInformation = document.getElementById("errorInformation");

submit.addEventListener("click", (e) => {
   e.preventDefault();
   const email = document.getElementById("emailUser").value;
   const password = document.getElementById("password").value;
   
   if (!email || !password) {
       document.getElementById("errorInformation").innerHTML = "E-mail ou un mot de passe invalide";
       return;
   }
        fetch("http://localhost:5678/api/users/login", {
           method: "POST",
           headers: {
               accept: "application/json",
               "Content-type": "application/json",
           },
           body: JSON.stringify({email: email, password: password}),
       })
       .then(function (response) {
           
           if (response.status === 200) {
               return response.json();
           } else {
               errorInformation.innerHTML = "Erreur E-mail ou mot de passe";
               return Promise.reject();
           }
           })
        .then(function (userInformation) {
               
            if (userInformation) {
            window.sessionStorage.setItem("userInformation", JSON.stringify(userInformation));
            window.sessionStorage.setItem("token", userInformation.token);
            window.location.replace("./admin.html");
           }
        })
        .catch(error => console.error(error));
});