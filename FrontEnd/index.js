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


