document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");

  if (loginForm) {
    loginForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;

      try {
        const response = await fetch("http://localhost:5678/api/users/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });

        if (response.ok) {
          const data = await response.json();
          const token = data.token;

          // Stocke le token en local pour les futures requêtes
          localStorage.setItem("authToken", token);

          // Redirige l'utilisateur vers la page d'accueil
          window.location.href = "index.html";
        } else if (response.status === 401) {
          // Affiche un message d'erreur pour une combinaison email/mot de passe incorrecte
          displayErrorMessage("Email ou mot de passe incorrect.");
        } else {
          displayErrorMessage("Une erreur est survenue. Veuillez réessayer.");
        }
      } catch (error) {
        console.error("Erreur lors de la connexion :", error);
        displayErrorMessage("Impossible de se connecter au serveur.");
      }
    });
  }

  function displayErrorMessage(message) {
    let errorContainer = document.getElementById("error-message");

    // Crée le conteneur d'erreur s'il n'existe pas
    if (!errorContainer) {
      errorContainer = document.createElement("p");
      errorContainer.id = "error-message";
      errorContainer.style.color = "red";
      loginForm.prepend(errorContainer);
    }

    errorContainer.textContent = message;
  }
});

