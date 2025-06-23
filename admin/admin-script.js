// Script d'administration pour le portfolio
let adminCode = '888888';
let isLoggedIn = false;
let portfolioSettings = {
    showCV: true,
    showFutureProjects: true,
    showAddPage: true
};
let projects = [];
let realizations = [];
let confirmCallback = null;

// Charger les données depuis le localStorage
function loadData() {
    const savedCode = localStorage.getItem('portfolioAdminCode');
    if (savedCode) {
        adminCode = savedCode;
    }
    
    const savedSettings = localStorage.getItem('portfolioSettings');
    if (savedSettings) {
        portfolioSettings = JSON.parse(savedSettings);
        updateToggleStates();
    }
    
    const savedProjects = localStorage.getItem('portfolioProjects');
    if (savedProjects) {
        projects = JSON.parse(savedProjects);
    }
    
    const savedRealizations = localStorage.getItem('portfolioRealizations');
    if (savedRealizations) {
        realizations = JSON.parse(savedRealizations);
    }
}

// Sauvegarder les données dans le localStorage
function saveData() {
    localStorage.setItem('portfolioAdminCode', adminCode);
    localStorage.setItem('portfolioSettings', JSON.stringify(portfolioSettings));
    localStorage.setItem('portfolioProjects', JSON.stringify(projects));
    localStorage.setItem('portfolioRealizations', JSON.stringify(realizations));
}

// Connexion administrateur
function login() {
    const inputCode = document.getElementById('adminCode').value;
    const messageDiv = document.getElementById('loginMessage');
    
    if (inputCode === adminCode) {
        isLoggedIn = true;
        document.getElementById('loginSection').classList.add('hidden');
        document.getElementById('adminPanel').classList.remove('hidden');
        showMessage('loginMessage', 'Connexion réussie !', 'success');
    } else {
        showMessage('loginMessage', 'Code administrateur incorrect', 'error');
    }
}

// Déconnexion
function logout() {
    isLoggedIn = false;
    document.getElementById('loginSection').classList.remove('hidden');
    document.getElementById('adminPanel').classList.add('hidden');
    document.getElementById('adminCode').value = '';
    clearMessage('loginMessage');
}

// Afficher un message
function showMessage(elementId, message, type) {
    const messageDiv = document.getElementById(elementId);
    messageDiv.textContent = message;
    messageDiv.className = `message ${type}`;
    messageDiv.style.display = 'block';
    
    setTimeout(() => {
        clearMessage(elementId);
    }, 5000);
}

// Effacer un message
function clearMessage(elementId) {
    const messageDiv = document.getElementById(elementId);
    messageDiv.style.display = 'none';
}

// Mettre à jour l'état des toggles
function updateToggleStates() {
    const cvToggle = document.getElementById('cvToggle');
    const futureProjectsToggle = document.getElementById('futureProjectsToggle');
    const addPageToggle = document.getElementById('addPageToggle');
    
    if (portfolioSettings.showCV) {
        cvToggle.classList.add('active');
    } else {
        cvToggle.classList.remove('active');
    }
    
    if (portfolioSettings.showFutureProjects) {
        futureProjectsToggle.classList.add('active');
    } else {
        futureProjectsToggle.classList.remove('active');
    }
    
    if (portfolioSettings.showAddPage) {
        addPageToggle.classList.add('active');
    } else {
        addPageToggle.classList.remove('active');
    }
}

// Toggle CV
function toggleCV() {
    portfolioSettings.showCV = !portfolioSettings.showCV;
    updateToggleStates();
    saveData();
    updatePortfolioDisplay();
    showMessage('adminMessage', `Section CV ${portfolioSettings.showCV ? 'activée' : 'désactivée'}`, 'success');
}

// Toggle projets futurs
function toggleFutureProjects() {
    portfolioSettings.showFutureProjects = !portfolioSettings.showFutureProjects;
    updateToggleStates();
    saveData();
    updatePortfolioDisplay();
    showMessage('adminMessage', `Section Projets à venir ${portfolioSettings.showFutureProjects ? 'activée' : 'désactivée'}`, 'success');
}

// Toggle ajouter une nouvelle page
function toggleAddPage() {
    portfolioSettings.showAddPage = !portfolioSettings.showAddPage;
    updateToggleStates();
    saveData();
    updatePortfolioDisplay();
    showMessage('adminMessage', `Section Ajouter une nouvelle page ${portfolioSettings.showAddPage ? 'activée' : 'désactivée'}`, 'success');
}

// Mettre à jour l'affichage du portfolio
function updatePortfolioDisplay() {
    // Cette fonction sera appelée pour mettre à jour le portfolio principal
    // Elle communiquera avec la page principale via localStorage
    localStorage.setItem('portfolioDisplayUpdate', Date.now().toString());
}

// Ajouter un projet
function addProject() {
    const title = document.getElementById('projectTitle').value;
    const description = document.getElementById('projectDescription').value;
    const category = document.getElementById('projectCategory').value;
    const tags = document.getElementById('projectTags').value;
    const image = document.getElementById('projectImage').value;
    const link = document.getElementById('projectLink').value;
    
    if (!title || !description) {
        showMessage('adminMessage', 'Veuillez remplir au moins le titre et la description', 'error');
        return;
    }
    
    const project = {
        id: Date.now(),
        title: title,
        description: description,
        category: category,
        tags: tags.split(',').map(tag => tag.trim()),
        image: image || 'images/projects/default.jpg',
        link: link,
        dateAdded: new Date().toLocaleDateString('fr-FR')
    };
    
    projects.push(project);
    saveData();
    updatePortfolioDisplay();
    
    // Vider les champs
    document.getElementById('projectTitle').value = '';
    document.getElementById('projectDescription').value = '';
    document.getElementById('projectTags').value = '';
    document.getElementById('projectImage').value = '';
    document.getElementById('projectLink').value = '';
    
    showMessage('adminMessage', 'Projet ajouté avec succès !', 'success');
}

// Afficher la liste des projets
function showProjectList() {
    const modal = document.getElementById('projectManagementModal');
    const projectList = document.getElementById('projectManagementList');
    
    let html = '<div class="projects-grid">';
    
    projects.forEach((project, index) => {
        html += `
            <div class="project-item">
                <h4>${project.title}</h4>
                <p>${project.description}</p>
                <p><strong>Catégorie:</strong> ${project.category}</p>
                <p><strong>Technologies:</strong> ${project.tags.join(', ')}</p>
                <p><strong>Ajouté le:</strong> ${project.dateAdded}</p>
                <div class="project-actions">
                    <button class="btn-edit" onclick="editProject(${index})">
                        <i class="fas fa-edit"></i> Modifier
                    </button>
                    <button class="btn-delete" onclick="requestDeleteProject(${index})">
                        <i class="fas fa-trash"></i> Supprimer
                    </button>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    
    if (projects.length === 0) {
        html = '<p style="text-align: center; color: #666;">Aucun projet personnalisé ajouté</p>';
    }
    
    projectList.innerHTML = html;
    modal.style.display = 'block';
}

// Fermer la modal de gestion des projets
function closeProjectManagementModal() {
    document.getElementById('projectManagementModal').style.display = 'none';
}

// Modifier un projet
function editProject(index) {
    const project = projects[index];
    document.getElementById('projectTitle').value = project.title;
    document.getElementById('projectDescription').value = project.description;
    document.getElementById('projectCategory').value = project.category;
    document.getElementById('projectTags').value = project.tags.join(', ');
    document.getElementById('projectImage').value = project.image;
    document.getElementById('projectLink').value = project.link;
    
    // Supprimer l'ancien projet
    projects.splice(index, 1);
    saveData();
    
    closeProjectManagementModal();
    showMessage('adminMessage', 'Projet chargé pour modification', 'info');
}

// Demander confirmation de suppression d'un projet
function requestDeleteProject(index) {
    const project = projects[index];
    document.getElementById('confirmMessage').textContent = 
        `Êtes-vous sûr de vouloir supprimer le projet "${project.title}" ?`;
    document.getElementById('confirmModal').style.display = 'block';
    
    confirmCallback = () => {
        projects.splice(index, 1);
        saveData();
        updatePortfolioDisplay();
        showProjectList(); // Rafraîchir la liste
        showMessage('adminMessage', 'Projet supprimé avec succès', 'success');
    };
}

// Ajouter une réalisation
function addRealization() {
    const url = document.getElementById('realizationUrl').value;
    const customTitle = document.getElementById('realizationTitle').value;
    const customDescription = document.getElementById('realizationDescription').value;
    
    if (!url) {
        showMessage('adminMessage', 'Veuillez entrer une URL', 'error');
        return;
    }
    
    // Simuler la récupération des métadonnées (dans un vrai projet, cela se ferait côté serveur)
    const realization = {
        id: Date.now(),
        url: url,
        title: customTitle || extractTitleFromUrl(url),
        description: customDescription || 'Réalisation web ajoutée via lien',
        image: 'images/projects/web-realization.jpg', // Image par défaut
        dateAdded: new Date().toLocaleDateString('fr-FR')
    };
    
    realizations.push(realization);
    saveData();
    updatePortfolioDisplay();
    
    // Vider les champs
    document.getElementById('realizationUrl').value = '';
    document.getElementById('realizationTitle').value = '';
    document.getElementById('realizationDescription').value = '';
    
    showMessage('adminMessage', 'Réalisation ajoutée avec succès !', 'success');
}

// Extraire un titre depuis une URL
function extractTitleFromUrl(url) {
    try {
        const domain = new URL(url).hostname.replace('www.', '');
        return `Réalisation - ${domain}`;
    } catch {
        return 'Réalisation web';
    }
}

// Afficher la liste des réalisations
function showRealizationList() {
    const modal = document.getElementById('realizationManagementModal');
    const realizationList = document.getElementById('realizationManagementList');
    
    let html = '<div class="projects-grid">';
    
    realizations.forEach((realization, index) => {
        html += `
            <div class="project-item">
                <h4>${realization.title}</h4>
                <p>${realization.description}</p>
                <p><strong>URL:</strong> <a href="${realization.url}" target="_blank">${realization.url}</a></p>
                <p><strong>Ajouté le:</strong> ${realization.dateAdded}</p>
                <div class="project-actions">
                    <button class="btn-edit" onclick="editRealization(${index})">
                        <i class="fas fa-edit"></i> Modifier
                    </button>
                    <button class="btn-delete" onclick="requestDeleteRealization(${index})">
                        <i class="fas fa-trash"></i> Supprimer
                    </button>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    
    if (realizations.length === 0) {
        html = '<p style="text-align: center; color: #666;">Aucune réalisation ajoutée</p>';
    }
    
    realizationList.innerHTML = html;
    modal.style.display = 'block';
}

// Fermer la modal de gestion des réalisations
function closeRealizationManagementModal() {
    document.getElementById('realizationManagementModal').style.display = 'none';
}

// Modifier une réalisation
function editRealization(index) {
    const realization = realizations[index];
    document.getElementById('realizationUrl').value = realization.url;
    document.getElementById('realizationTitle').value = realization.title;
    document.getElementById('realizationDescription').value = realization.description;
    
    // Supprimer l'ancienne réalisation
    realizations.splice(index, 1);
    saveData();
    
    closeRealizationManagementModal();
    showMessage('adminMessage', 'Réalisation chargée pour modification', 'info');
}

// Demander confirmation de suppression d'une réalisation
function requestDeleteRealization(index) {
    const realization = realizations[index];
    document.getElementById('confirmMessage').textContent = 
        `Êtes-vous sûr de vouloir supprimer la réalisation "${realization.title}" ?`;
    document.getElementById('confirmModal').style.display = 'block';
    
    confirmCallback = () => {
        realizations.splice(index, 1);
        saveData();
        updatePortfolioDisplay();
        showRealizationList(); // Rafraîchir la liste
        showMessage('adminMessage', 'Réalisation supprimée avec succès', 'success');
    };
}

// Changer le code administrateur
function changeAdminCode() {
    const newCode = document.getElementById('newAdminCode').value;
    const confirmCode = document.getElementById('confirmAdminCode').value;
    
    if (!newCode || !confirmCode) {
        showMessage('adminMessage', 'Veuillez remplir les deux champs', 'error');
        return;
    }
    
    if (newCode !== confirmCode) {
        showMessage('adminMessage', 'Les codes ne correspondent pas', 'error');
        return;
    }
    
    if (newCode.length < 6) {
        showMessage('adminMessage', 'Le code doit contenir au moins 6 caractères', 'error');
        return;
    }
    
    adminCode = newCode;
    saveData();
    
    document.getElementById('newAdminCode').value = '';
    document.getElementById('confirmAdminCode').value = '';
    
    showMessage('adminMessage', 'Code administrateur modifié avec succès', 'success');
}

// Confirmer une action
function confirmAction() {
    if (confirmCallback) {
        confirmCallback();
        confirmCallback = null;
    }
    closeConfirmModal();
}

// Fermer la modal de confirmation
function closeConfirmModal() {
    document.getElementById('confirmModal').style.display = 'none';
    confirmCallback = null;
}

// Fermer les modals en cliquant à l'extérieur
window.onclick = function(event) {
    const projectModal = document.getElementById('projectManagementModal');
    const realizationModal = document.getElementById('realizationManagementModal');
    const confirmModal = document.getElementById('confirmModal');
    
    if (event.target === projectModal) {
        closeProjectManagementModal();
    }
    if (event.target === realizationModal) {
        closeRealizationManagementModal();
    }
    if (event.target === confirmModal) {
        closeConfirmModal();
    }
}

// Initialisation
document.addEventListener('DOMContentLoaded', function() {
    loadData();
    
    // Permettre la connexion avec Entrée
    document.getElementById('adminCode').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            login();
        }
    });
});

// Exporter les données pour le portfolio principal
function getPortfolioData() {
    return {
        settings: portfolioSettings,
        projects: projects,
        realizations: realizations
    };
}

