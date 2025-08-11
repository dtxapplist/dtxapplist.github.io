document.addEventListener("DOMContentLoaded", () => {
    const appList = document.getElementById("app-list");
    const searchInput = document.getElementById("search");

    const popup = document.getElementById("popup");
    const popupTitle = document.getElementById("popup-title");
    const popupInstructions = document.getElementById("popup-instructions");
    const popupClose = document.getElementById("popup-close");

    let currentApp = null;

    function renderApps(filter = "") {
        appList.innerHTML = "";

        const filteredApps = apps.filter(app => 
            app.name.toLowerCase().includes(filter.toLowerCase())
        );

        if (filteredApps.length === 0) {
            appList.innerHTML = `
                <div style="color: #81a1c1; margin: 20px;">
                    Aradığınız uygulama bulunamadı.
                </div>
            `;
            return;
        }

        filteredApps.forEach(app => {
            const card = document.createElement("div");
            card.className = "card";

            // Icon elementi - SVG ve PNG desteği eklendi
            const iconElement = (app.icon.includes('.png') || app.icon.includes('.svg'))
                ? `<img src="${app.icon}" alt="${app.name}">` 
                : `<div class="card-icon">${app.icon}</div>`;

            card.innerHTML = `
                ${iconElement}
                <div class="card-content">
                    <div class="app-name">${app.name}</div>
                    <div class="status ${app.supported ? "green" : "red"}">
                        ${app.supported 
                            ? "Linux'ta destekleniyor" 
                            : `Desteklenmiyor - Alternatif: <span class="alt">${app.alt}</span>`
                        }
                    </div>
                </div>
                <div class="card-buttons">
                    ${app.supported ? `<button class="info-btn install-btn" data-action="install">📦</button>` : ''}
                    <button class="info-btn about-btn" data-action="about">ℹ️</button>
                </div>
            `;

            // Kurulum butonu event listener'ı
            if (app.supported) {
                const installBtn = card.querySelector('.install-btn');
                installBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    showInstallPopup(app);
                });
            }

            // Hakkında butonu event listener'ı
            const aboutBtn = card.querySelector('.about-btn');
            aboutBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                showAboutPopup(app);
            });

            appList.appendChild(card);
        });
    }

    function showInstallPopup(app) {
        popupTitle.textContent = `${app.name} - Kurulum`;
        
        popupInstructions.innerHTML = '';
        
        const tabContainer = document.createElement('div');
        const tabButtons = document.createElement('div');
        tabButtons.className = 'tab-buttons';
        
        const tabContent = document.createElement('div');
        tabContent.className = 'tab-content';
        
        let firstDistro = Object.keys(app.install)[0];
        
        Object.keys(app.install).forEach((distro, index) => {
            const button = document.createElement('button');
            button.className = `tab-button ${index === 0 ? 'active' : ''}`;
            button.textContent = distro;
            
            button.addEventListener('click', () => {
                tabButtons.querySelectorAll('.tab-button').forEach(btn => 
                    btn.classList.remove('active')
                );
                button.classList.add('active');
                tabContent.textContent = app.install[distro];
            });
            
            tabButtons.appendChild(button);
        });
        
        tabContent.textContent = app.install[firstDistro];
        
        tabContainer.appendChild(tabButtons);
        tabContainer.appendChild(tabContent);
        popupInstructions.appendChild(tabContainer);
        
        popup.classList.remove("hidden");
        popup.classList.add("visible");
    }

    function showAboutPopup(app) {
        if (app.supported) {
            // Desteklenen uygulama için tek uygulama göster
            popupTitle.textContent = `${app.name} - Hakkında`;
            
            popupInstructions.innerHTML = '';
            
            const tabContainer = document.createElement('div');
            const tabButtons = document.createElement('div');
            tabButtons.className = 'tab-buttons';
            
            const tabContent = document.createElement('div');
            tabContent.className = 'tab-content about-content';
            
            // Ekran Görüntüsü tab
            const screenshotBtn = document.createElement('button');
            screenshotBtn.className = 'tab-button active';
            screenshotBtn.textContent = 'Ekran Görüntüsü';
            
            // Web Sitesi tab
            const websiteBtn = document.createElement('button');
            websiteBtn.className = 'tab-button';
            websiteBtn.textContent = 'Web Sitesi';
            
            screenshotBtn.addEventListener('click', () => {
                tabButtons.querySelectorAll('.tab-button').forEach(btn => 
                    btn.classList.remove('active')
                );
                screenshotBtn.classList.add('active');
                tabContent.innerHTML = `<img src="${app.about.screenshot}" alt="${app.name} ekran görüntüsü" class="screenshot">`;
            });
            
            websiteBtn.addEventListener('click', () => {
                tabButtons.querySelectorAll('.tab-button').forEach(btn => 
                    btn.classList.remove('active')
                );
                websiteBtn.classList.add('active');
                tabContent.innerHTML = `<a href="${app.about.website}" target="_blank" class="website-link">${app.about.website}</a>`;
            });
            
            tabButtons.appendChild(screenshotBtn);
            tabButtons.appendChild(websiteBtn);
            
            // Varsayılan olarak ekran görüntüsünü göster
            tabContent.innerHTML = `<img src="${app.about.screenshot}" alt="${app.name} ekran görüntüsü" class="screenshot">`;
            
            tabContainer.appendChild(tabButtons);
            tabContainer.appendChild(tabContent);
            popupInstructions.appendChild(tabContainer);
        } else {
            // Desteklenmeyen uygulama için alternatifleri göster
            popupTitle.textContent = `${app.name} - Alternatifler`;
            
            popupInstructions.innerHTML = '';
            
            app.alternatives.forEach((alt, index) => {
                const altContainer = document.createElement('div');
                altContainer.className = 'alternative-container';
                
                const altHeader = document.createElement('div');
                altHeader.className = 'alternative-header';
                altHeader.innerHTML = `
                    <h3>${alt.name}</h3>
                    <p>${alt.description}</p>
                `;
                
                const tabContainer = document.createElement('div');
                const tabButtons = document.createElement('div');
                tabButtons.className = 'tab-buttons';
                
                const tabContent = document.createElement('div');
                tabContent.className = 'tab-content about-content';
                
                // Ekran Görüntüsü tab
                const screenshotBtn = document.createElement('button');
                screenshotBtn.className = 'tab-button active';
                screenshotBtn.textContent = 'Ekran Görüntüsü';
                
                // Web Sitesi tab
                const websiteBtn = document.createElement('button');
                websiteBtn.className = 'tab-button';
                websiteBtn.textContent = 'Web Sitesi';
                
                const altId = `alt-${index}`;
                
                screenshotBtn.addEventListener('click', () => {
                    tabButtons.querySelectorAll('.tab-button').forEach(btn => 
                        btn.classList.remove('active')
                    );
                    screenshotBtn.classList.add('active');
                    tabContent.innerHTML = `<img src="${alt.screenshot}" alt="${alt.name} ekran görüntüsü" class="screenshot">`;
                });
                
                websiteBtn.addEventListener('click', () => {
                    tabButtons.querySelectorAll('.tab-button').forEach(btn => 
                        btn.classList.remove('active')
                    );
                    websiteBtn.classList.add('active');
                    tabContent.innerHTML = `<a href="${alt.website}" target="_blank" class="website-link">${alt.website}</a>`;
                });
                
                tabButtons.appendChild(screenshotBtn);
                tabButtons.appendChild(websiteBtn);
                
                // Varsayılan olarak ekran görüntüsünü göster
                tabContent.innerHTML = `<img src="${alt.screenshot}" alt="${alt.name} ekran görüntüsü" class="screenshot">`;
                
                tabContainer.appendChild(tabButtons);
                tabContainer.appendChild(tabContent);
                
                altContainer.appendChild(altHeader);
                altContainer.appendChild(tabContainer);
                popupInstructions.appendChild(altContainer);
            });
        }
        
        popup.classList.remove("hidden");
        popup.classList.add("visible");
    }

    searchInput.addEventListener("input", e => {
        renderApps(e.target.value);
    });

    popupClose.addEventListener("click", () => {
        popup.classList.remove("visible");
        popup.classList.add("hidden");
        currentApp = null;
    });

    popup.addEventListener("click", (e) => {
        if (e.target === popup) {
            popup.classList.remove("visible");
            popup.classList.add("hidden");
            currentApp = null;
        }
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && popup.classList.contains("visible")) {
            popup.classList.remove("visible");
            popup.classList.add("hidden");
            currentApp = null;
        }
    });

    renderApps();
});= null;
    });

    popup.addEventListener("click", (e) => {
        if (e.target === popup) {
            popup.classList.remove("visible");
            popup.classList.add("hidden");
            currentApp = null;
        }
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && popup.classList.contains("visible")) {
            popup.classList.remove("visible");
            popup.classList.add("hidden");
            currentApp = null;
        }
    });

    renderApps();
});
