const worksUrl = 'http://localhost:5678/api/works';
const categoriesUrl = 'http://localhost:5678/api/categories';

// Fonction pour récupérer et afficher tous les travaux dans la galerie
async function fetchAndDisplayWorks(categoryId = null) {
  try {
    const response = await fetch(worksUrl);
    if (!response.ok) throw new Error("Erreur de chargement des travaux");

    let works = await response.json();
    
    // Filtrer les travaux par catégorie si un `categoryId` est fourni
    if (categoryId !== null) {
      works = works.filter(work => work.categoryId === categoryId);
    }

    const galleryDiv = document.querySelector('.gallery');
    galleryDiv.innerHTML = '';

    works.forEach(work => {
      const workElement = document.createElement('div');
      workElement.classList.add('work-item');

      const img = document.createElement('img');
      img.src = work.imageUrl;
      img.alt = work.title;

      const title = document.createElement('h3');
      title.textContent = work.title;

      workElement.appendChild(img);
      workElement.appendChild(title);
      galleryDiv.appendChild(workElement);
    });
  } catch (error) {
    console.error("Erreur:", error);
  }
}

// Fonction pour récupérer et afficher les catégories
async function fetchAndDisplayCategories() {
    try {
      const response = await fetch(categoriesUrl);
      if (!response.ok) throw new Error("Erreur de chargement des catégories");
  
      const categories = await response.json();
      const menuDiv = document.querySelector('.categories-menu');
      menuDiv.innerHTML = '';
  
      // Ajouter un bouton pour "Toutes les catégories"
      const allButton = document.createElement('button');
      allButton.textContent = 'Toutes les catégories';
      allButton.addEventListener('click', () => {
        fetchAndDisplayWorks();
        setSelectedButton(allButton);
      });
      menuDiv.appendChild(allButton);
  
      // Utiliser un Set pour éviter les doublons et créer un bouton pour chaque catégorie
      const uniqueCategories = new Set(categories.map(category => category.id));
      uniqueCategories.forEach(id => {
        const category = categories.find(c => c.id === id);
  
        const button = document.createElement('button');
        button.textContent = category.name;
        button.addEventListener('click', () => {
          fetchAndDisplayWorks(id);
          setSelectedButton(button);
        });
        menuDiv.appendChild(button);
      });
  
      // Sélectionner par défaut le bouton "Toutes les catégories"
      setSelectedButton(allButton);
    } catch (error) {
      console.error("Erreur:", error);
    }
  }
  
  // Fonction pour appliquer la classe "selected" au bouton actif
  function setSelectedButton(selectedButton) {
    document.querySelectorAll('.categories-menu button').forEach(button => {
      button.classList.remove('selected');
    });
    selectedButton.classList.add('selected');
  }
  

// Appeler les fonctions au démarrage
fetchAndDisplayWorks();
fetchAndDisplayCategories();

//----------------------------------------------------------------------------------------

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");

  loginForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;

      try {
          const response = await fetch("http://localhost:5678/api/login", {
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

