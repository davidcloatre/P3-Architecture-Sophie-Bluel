const worksUrl = 'http://localhost:5678/api/works';
const categoriesUrl = 'http://localhost:5678/api/categories';

// Fonction pour récupérer et afficher tous les travaux dans la galerie
async function fetchAndDisplayWorks(categoryId = null) {
  try {
    const response = await fetch(worksUrl);
    if (!response.ok) throw new Error("Erreur de chargement des travaux");

    let works = await response.json();
    
    // Filtrer les travaux par catégorie si un categoryId est fourni
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

//-------------Mode édition-----------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  // Vérifie si l'utilisateur est connecté en cherchant le token
  const isLoggedIn = localStorage.getItem("authToken") !== null;

  if (isLoggedIn) {
      // Affiche le bouton "Modifier" pour ouvrir la modale
      const editButton = document.getElementById("edit-button");
      if (editButton) {
          editButton.style.display = "flex"; // Affiche le bouton "Modifier"
      }

      // Masque le menu des catégories si l'utilisateur est connecté
      const categoriesMenu = document.querySelector('.categories-menu');
      if (categoriesMenu) {
          categoriesMenu.style.display = 'none';
      }

      // Ajoute la bannière "Mode édition" en haut du corps de la page
      const editBanner = document.createElement("div");
      editBanner.style.backgroundColor = "black";
      editBanner.style.color = "white";
      editBanner.style.padding = "10px";
      editBanner.style.height = "60px";
      editBanner.style.display = "flex";
      editBanner.style.alignItems = "center";
      editBanner.style.justifyContent = "center";
      editBanner.style.gap = "10px";
      editBanner.innerHTML = `<img src="./assets/icons/modifier.png" alt="logo modifier" style="width: 16px; height: 16px; filter: invert(100%);"/> Mode édition`;
      document.body.insertBefore(editBanner, document.body.firstChild);

      // Change le lien "login" en "logout"
      const loginLink = document.querySelector('li a[href="./login.html"]');
      if (loginLink) {
          loginLink.textContent = "Logout";
          loginLink.removeAttribute("href"); // Supprime le lien pour éviter la redirection

          // Gestion de la déconnexion au clic sur "Logout"
          loginLink.addEventListener("click", () => {
              localStorage.removeItem("authToken"); // Efface le token pour déconnecter
              window.location.href = "./index.html"; // Redirige vers la page de connexion
          });
      }
  }
});
//-----------------Modal---------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("modal");
  const editButton = document.getElementById("edit-button");
  const closeButton = document.querySelector(".close-button");
  const galleryView = document.getElementById("gallery-view");
  const addPhotoView = document.getElementById("add-photo-view");
  const addPhotoBtn = document.getElementById("add-photo-btn");
  const backToGalleryBtn = document.getElementById("back-to-gallery");

  // Fonction pour ouvrir la modale
  function openModal() {
    modal.style.display = "flex";
    modal.style.justifyContent = "center";
    modal.style.alignItems = "center";
  }

  // Fonction pour fermer la modale
  function closeModal() {
    modal.style.display = "none";
    document.body.style.overflow = ""; // Restaure le défilement de la page
  }

  // Event listeners pour ouverture et fermeture de la modale
  if (editButton) {
    editButton.addEventListener("click", openModal);
  }
  
  if (closeButton) {
    closeButton.addEventListener("click", closeModal);
  }

  // Ferme la modale en cliquant en dehors du contenu de la modale
  modal.addEventListener("click", (event) => {
    if (event.target === modal) closeModal();
  });

  // Limite la hauteur de la modale et la centre
  modal.style.display = "none"; // Cache la modale par défaut

  // Gère l'affichage entre Galerie photo et Ajout photo
  if (addPhotoBtn && backToGalleryBtn) {
    addPhotoBtn.addEventListener("click", () => {
      galleryView.style.display = "none";
      addPhotoView.style.display = "block";
    });

    backToGalleryBtn.addEventListener("click", () => {
      addPhotoView.style.display = "none";
      galleryView.style.display = "block";
    });
  }
});

