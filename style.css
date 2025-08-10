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

            // Eğer icon string ise (emoji), card-icon div'i kullan
            // Eğer .png ile bitiyorsa, img elementi kullan
            const iconElement = app.icon.includes('.png') 
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
            `;

            card.addEventListener("click", () => {
                currentApp = app;
                showPopup(app);
            });

            appList.appendChild(card);
        });
    }

    function showPopup(app) {
        popupTitle.textContent = app.supported ? app.name : `${app.name} (${app.alt})`;
        
        // Popup içeriğini temizle ve yeniden oluştur
        popupInstructions.innerHTML = '';
        
        // Tab butonlarını oluştur
        const tabContainer = document.createElement('div');
        const tabButtons = document.createElement('div');
        tabButtons.className = 'tab-buttons';
        
        const tabContent = document.createElement('div');
        tabContent.className = 'tab-content';
        
        // İlk distroyu varsayılan olarak seç
        let firstDistro = Object.keys(app.install)[0];
        let activeDistro = firstDistro;
        
        // Her distro için tab butonu oluştur
        Object.keys(app.install).forEach((distro, index) => {
            const button = document.createElement('button');
            button.className = `tab-button ${index === 0 ? 'active' : ''}`;
            button.textContent = distro;
            
            button.addEventListener('click', () => {
                // Tüm butonlardan active sınıfını kaldır
                tabButtons.querySelectorAll('.tab-button').forEach(btn => 
                    btn.classList.remove('active')
                );
                // Bu butona active sınıfını ekle
                button.classList.add('active');
                
                // İçeriği güncelle
                activeDistro = distro;
                tabContent.textContent = app.install[distro];
            });
            
            tabButtons.appendChild(button);
        });
        
        // İlk distronun içeriğini göster
        tabContent.textContent = app.install[firstDistro];
        
        // Popup'a ekle
        tabContainer.appendChild(tabButtons);
        tabContainer.appendChild(tabContent);
        popupInstructions.appendChild(tabContainer);
        
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

    // Escape tuşu ile popup'ı kapatma
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && popup.classList.contains("visible")) {
            popup.classList.remove("visible");
            popup.classList.add("hidden");
            currentApp = null;
        }
    });

    renderApps();
});
