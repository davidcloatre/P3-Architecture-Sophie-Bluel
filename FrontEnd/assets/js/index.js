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
  const worksGallery = document.getElementById("works-gallery");
  const backToGallery = document.getElementById("back-to-gallery");

  // Fonction pour ouvrir la modale
  function openModal() {
    modal.style.display = "flex";
    document.body.style.overflow = "hidden";
    loadWorksIntoModal();
    loadCategories();
  }

  // Fonction pour fermer la modale
  function closeModal() {
    modal.style.display = "none";
    document.body.style.overflow = "";
  }

  // Event listeners pour l'ouverture et la fermeture de la modale
  if (editButton) {
    editButton.addEventListener("click", openModal);
  }

  if (closeButton) {
    closeButton.addEventListener("click", closeModal);
  }

  // Fermer la modale en cliquant en dehors de son contenu
  modal.addEventListener("click", (event) => {
    if (event.target === modal) closeModal();
  });

  // Charger les travaux dans la galerie de la modale
  async function loadWorksIntoModal() {
    try {
      const response = await fetch("http://localhost:5678/api/works");
      if (!response.ok) throw new Error("Erreur de chargement des travaux");

      const works = await response.json();
      worksGallery.innerHTML = ""; // Vide le contenu précédent de la galerie

      works.forEach(work => {
        const workItem = document.createElement("div");
        workItem.classList.add("work-item");

        // Image du travail
        const img = document.createElement("img");
        img.src = work.imageUrl;
        img.alt = work.title;
        img.style.width = "100%";

        // Bouton de suppression
        const deleteButton = document.createElement("button");
        deleteButton.classList.add("delete-button");
        deleteButton.innerHTML = `<img src="./assets/icons/trash.png" alt="Supprimer" />`;
        deleteButton.addEventListener("click", () => deleteWork(work.id));

        // Ajout des éléments dans l'élément du travail
        workItem.appendChild(img);
        workItem.appendChild(deleteButton);
        worksGallery.appendChild(workItem);
      });
    } catch (error) {
      console.error("Erreur:", error);
    }
  }

  // Fonction pour supprimer un travail par ID
  async function deleteWork(workId) {
    try {
      const response = await fetch(`http://localhost:5678/api/works/${workId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("authToken")}`
        }
      });

      if (!response.ok) throw new Error("Erreur de suppression du travail");

      // Actualise la galerie dans la modal après suppression
      loadWorksIntoModal();
    } catch (error) {
      console.error("Erreur:", error);
    }
  }

  // Affichage de la vue d'ajout photo
  document.getElementById('add-photo-btn').addEventListener('click', () => {
    galleryView.style.display = 'none';
    addPhotoView.style.display = 'flex';
    backToGallery.style.display = 'block';
    
  });

  // Retour à la galerie depuis la vue d'ajout photo
  document.getElementById('back-to-gallery').addEventListener('click', () => {
    addPhotoView.style.display = 'none';
    galleryView.style.display = 'block';
    backToGallery.style.display = 'none'
   
  });

  // Prévisualisation de l'image
  document.getElementById('photo-file').addEventListener('change', function(event) {
    const file = event.target.files[0];
    const photoPreview = document.getElementById('photo-preview');
  
    if (file) {
      const reader = new FileReader();
      reader.onload = function(e) {
        photoPreview.src = e.target.result;
        photoPreview.style.display = ''; // Afficher la prévisualisation
      };
      reader.readAsDataURL(file);
    } else {
      photoPreview.style.display = 'none';
      photoPreview.src = '#';
    }
  });
  

  // Chargement des catégories dynamiquement via l'API
  async function loadCategories() {
    try {
      const response = await fetch("http://localhost:5678/api/categories");
      if (!response.ok) throw new Error("Erreur lors du chargement des catégories");
  
      const categories = await response.json();
      const categorySelect = document.getElementById("photo-category");
      categorySelect.innerHTML = ''; // Vide les options actuelles
  
      // Ajouter une option vide par défaut
      const emptyOption = document.createElement("option");
      emptyOption.value = '';
      emptyOption.textContent = '';
      categorySelect.appendChild(emptyOption);
  
      // Ajouter les catégories
      categories.forEach(category => {
        const option = document.createElement("option");
        option.value = category.id;
        option.textContent = category.name;
        categorySelect.appendChild(option);
      });
    } catch (error) {
      console.error("Erreur:", error);
    }
  }
  

  // Soumission du formulaire pour ajouter une photo
  document.getElementById('add-photo-form').addEventListener('submit', async function(e) {
    e.preventDefault();
  
    // Récupérer les données du formulaire
    const photoFile = document.getElementById('photo-file').files[0];
    const title = document.getElementById('photo-title').value;
    const category = document.getElementById('photo-category').value;
  
    // Vérifier si tous les champs sont remplis
    if (!photoFile || !title || !category) {
      alert('Veuillez remplir tous les champs.');
      return;
    }
  
    // Créer un objet FormData
    const formData = new FormData();
    formData.append('image', photoFile); // Clé attendue par l'API
    formData.append('title', title);
    formData.append('category', category);
  
    // Récupérer le token depuis le localStorage
    const token = localStorage.getItem("authToken");
  
    if (!token) {
      alert("Vous devez être connecté pour ajouter un projet.");
      return;
    }
  
    try {
      // Envoyer la requête POST
      const response = await fetch('http://localhost:5678/api/works', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`, // En-tête d'authentification
          'accept': 'application/json'       // En-tête optionnel
        },
        body: formData // FormData contient les champs sous forme multipart/form-data
      });
  
      // Gérer la réponse
      if (response.ok) {
        const newWork = await response.json();
        alert('Projet ajouté avec succès !');
        
        // Ajouter le projet dans le DOM
        ajouterProjetDansDOM(newWork);
  
        // Réinitialiser le formulaire
        document.getElementById('add-photo-form').reset();
        document.getElementById('photo-preview').style.backgroundImage = '';
        backToGallery.click(); // Retourner à la galerie
      } else if (response.status === 401) {
        alert("Votre session a expiré. Veuillez vous reconnecter.");
        localStorage.removeItem("authToken");
      } else {
        const errorData = await response.json();
        alert(`Erreur : ${errorData.message || "Impossible d'ajouter le projet."}`);
      }
    } catch (error) {
      console.error("Erreur réseau :", error);
      alert("Erreur de connexion au serveur.");
    }
  });

  // Fonction pour ajouter un nouveau projet dans la galerie
  function ajouterProjetDansDOM(projet) {
    const projectElement = document.createElement("div");
    projectElement.classList.add("project-item");
    projectElement.innerHTML = `
      <img src="${projet.imageUrl}" alt="${projet.title}">
      <p>${projet.title}</p>
    `;
  
    // Ajouter l'élément à la galerie principale
    document.querySelector(".gallery").appendChild(projectElement);
  
    // Optionnel : Ajouter dans la liste d'images de la modale
    const modalGallery = document.querySelector(".modal-gallery");
    if (modalGallery) {
      modalGallery.appendChild(projectElement.cloneNode(true));
    }
  }
});
