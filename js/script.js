// Fonctionnalités principales du portfolio
document.addEventListener('DOMContentLoaded', function() {
    // Menu mobile toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
    
    // Animations au défilement
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.animate-on-scroll');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.2;
            
            if (elementPosition < screenPosition) {
                element.classList.add('animated');
            }
        });
    };
    
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Exécuter une fois au chargement
    
    // Filtrage des projets
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    
    if (filterButtons.length > 0 && projectCards.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Retirer la classe active de tous les boutons
                filterButtons.forEach(btn => btn.classList.remove('active'));
                
                // Ajouter la classe active au bouton cliqué
                this.classList.add('active');
                
                const filterValue = this.getAttribute('data-filter');
                
                projectCards.forEach(card => {
                    if (filterValue === 'all' || card.classList.contains(filterValue)) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }
    
    // Gestion du téléchargement de photo
    const photoUpload = document.getElementById('photo-upload');
    const photoPreview = document.getElementById('photo-preview');
    
    if (photoUpload && photoPreview) {
        photoUpload.addEventListener('change', function() {
            const file = this.files[0];
            
            if (file) {
                const reader = new FileReader();
                
                reader.addEventListener('load', function() {
                    photoPreview.src = reader.result;
                    
                    // Stocker l'image dans le localStorage pour la persistance
                    localStorage.setItem('portfolioProfilePhoto', reader.result);
                });
                
                reader.readAsDataURL(file);
            }
        });
        
        // Charger la photo depuis le localStorage si disponible
        const savedPhoto = localStorage.getItem('portfolioProfilePhoto');
        if (savedPhoto) {
            photoPreview.src = savedPhoto;
        }
    }
    
    // Gestion des projets à venir
    const addProjectForm = document.getElementById('add-project-form');
    
    if (addProjectForm) {
        addProjectForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const projectTitle = document.getElementById('project-title').value;
            const projectDescription = document.getElementById('project-description').value;
            const projectStatus = document.getElementById('project-status').value;
            
            if (projectTitle && projectDescription) {
                // Créer un nouvel élément de projet
                const futureProjectsContainer = document.querySelector('.future-projects-container');
                
                if (futureProjectsContainer) {
                    const newProjectCard = document.createElement('div');
                    newProjectCard.className = 'future-project-card animate-on-scroll animated';
                    
                    // Déterminer l'icône en fonction du statut
                    let icon = 'lightbulb';
                    if (projectStatus === 'Planifié') icon = 'calendar-alt';
                    if (projectStatus === 'En développement') icon = 'code';
                    
                    newProjectCard.innerHTML = `
                        <div class="future-project-icon">
                            <i class="fas fa-${icon}"></i>
                        </div>
                        <div class="future-project-content">
                            <h3 class="future-project-title">${projectTitle}</h3>
                            <p class="future-project-description">${projectDescription}</p>
                            <span class="future-project-status">${projectStatus}</span>
                        </div>
                    `;
                    
                    futureProjectsContainer.appendChild(newProjectCard);
                    addProjectForm.reset();
                    
                    // Afficher un message de succès
                    alert('Projet ajouté avec succès !');
                }
            }
        });
    }
    
    // Prévisualisation du CV
    const downloadButtons = document.querySelectorAll('.download-button');
    const cvPreviewFrame = document.getElementById('cv-preview-frame');
    
    if (downloadButtons.length > 0 && cvPreviewFrame) {
        downloadButtons.forEach(button => {
            button.addEventListener('mouseover', function() {
                const previewUrl = this.getAttribute('data-preview');
                if (previewUrl) {
                    cvPreviewFrame.src = previewUrl;
                }
            });
        });
    }
    
    // Formulaire de contact
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;
            
            if (name && email && subject && message) {
                // Simuler l'envoi du formulaire
                alert(`Merci ${name} ! Votre message a été envoyé avec succès. Je vous répondrai dans les plus brefs délais.`);
                contactForm.reset();
            }
        });
    }
    
    // Fonction pour créer une nouvelle page (utilisée dans add-page.html)
    window.createNewPage = function() {
        const pageTitle = document.getElementById('page-title');
        const pageContent = document.getElementById('page-content');
        
        if (pageTitle && pageContent && pageTitle.value && pageContent.innerHTML) {
            // Dans une application réelle, cela créerait un nouveau fichier HTML
            alert(`La page "${pageTitle.value}" a été créée avec succès !`);
        } else {
            alert('Veuillez remplir tous les champs requis.');
        }
    };
});

// Intégration avec l'administration
function loadAdminSettings() {
    const settings = JSON.parse(localStorage.getItem('portfolioSettings') || '{"showCV": true, "showFutureProjects": true, "showAddPage": true}');
    const projects = JSON.parse(localStorage.getItem('portfolioProjects') || '[]');
    const realizations = JSON.parse(localStorage.getItem('portfolioRealizations') || '[]');
    
    // Gérer l'affichage de la section CV
    const cvSection = document.getElementById('cv');
    const cvNavLink = document.querySelector('a[href="#cv"]');
    if (cvSection && cvNavLink) {
        if (settings.showCV) {
            cvSection.style.display = 'block';
            cvNavLink.style.display = 'block';
        } else {
            cvSection.style.display = 'none';
            cvNavLink.style.display = 'none';
        }
    }
    
    // Gérer l'affichage de la section Projets à venir
    const futureProjectsSection = document.getElementById('future-projects');
    const futureProjectsNavLink = document.querySelector('a[href="#future-projects"]');
    if (futureProjectsSection && futureProjectsNavLink) {
        if (settings.showFutureProjects) {
            futureProjectsSection.style.display = 'block';
            futureProjectsNavLink.style.display = 'block';
        } else {
            futureProjectsSection.style.display = 'none';
            futureProjectsNavLink.style.display = 'none';
        }
    }
    
    // Gérer l'affichage de la section Ajouter une nouvelle page
    const addPageSection = document.getElementById('add-page');
    if (addPageSection) {
        if (settings.showAddPage) {
            addPageSection.style.display = 'block';
        } else {
            addPageSection.style.display = 'none';
        }
    }
    
    // Ajouter les projets personnalisés
    addCustomProjects(projects);
    
    // Ajouter les réalisations
    addRealizations(realizations);
}

function addCustomProjects(projects) {
    const projectsGrid = document.querySelector('.projects-grid');
    if (!projectsGrid || projects.length === 0) return;
    
    projects.forEach(project => {
        const projectCard = document.createElement('div');
        projectCard.className = `project-card ${project.category} animate-on-scroll`;
        
        projectCard.innerHTML = `
            <div class="project-image">
                <img src="${project.image}" alt="${project.title}" onerror="this.src='images/projects/web-realization.jpg'">
                <div class="project-overlay">
                    <h3>${project.title}</h3>
                </div>
            </div>
            <div class="project-content">
                <h3 class="project-title">${project.title}</h3>
                <p class="project-description">${project.description}</p>
                <div class="project-tags">
                    ${project.tags.map(tag => `<span class="project-tag">${tag}</span>`).join('')}
                </div>
                <div class="project-links">
                    ${project.link ? `<a href="${project.link}" target="_blank" class="project-link view">Voir le site</a>` : ''}
                    <span class="project-link code" style="background: #6c757d; cursor: default;">Projet personnalisé</span>
                </div>
            </div>
        `;
        
        projectsGrid.appendChild(projectCard);
    });
}

function addRealizations(realizations) {
    const projectsGrid = document.querySelector('.projects-grid');
    if (!projectsGrid || realizations.length === 0) return;
    
    realizations.forEach(realization => {
        const realizationCard = document.createElement('div');
        realizationCard.className = 'project-card web animate-on-scroll';
        
        realizationCard.innerHTML = `
            <div class="project-image">
                <img src="${realization.image}" alt="${realization.title}">
                <div class="project-overlay">
                    <h3>${realization.title}</h3>
                </div>
            </div>
            <div class="project-content">
                <h3 class="project-title">${realization.title}</h3>
                <p class="project-description">${realization.description}</p>
                <div class="project-tags">
                    <span class="project-tag">Réalisation Web</span>
                </div>
                <div class="project-links">
                    <a href="${realization.url}" target="_blank" class="project-link view">Voir le site</a>
                    <span class="project-link code" style="background: #28a745; cursor: default;">Réalisation</span>
                </div>
            </div>
        `;
        
        projectsGrid.appendChild(realizationCard);
    });
}

// Écouter les changements depuis l'administration
function watchAdminChanges() {
    let lastUpdate = localStorage.getItem('portfolioDisplayUpdate');
    
    setInterval(() => {
        const currentUpdate = localStorage.getItem('portfolioDisplayUpdate');
        if (currentUpdate && currentUpdate !== lastUpdate) {
            lastUpdate = currentUpdate;
            // Recharger la page pour appliquer les changements
            location.reload();
        }
    }, 1000);
}

// Initialiser l'intégration admin au chargement de la page
document.addEventListener('DOMContentLoaded', function() {
    // Attendre que le DOM soit complètement chargé
    setTimeout(() => {
        loadAdminSettings();
        watchAdminChanges();
    }, 100);
});

