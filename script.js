document.addEventListener("DOMContentLoaded", () => {
    const appList = document.getElementById("app-list");
    const searchInput = document.getElementById("search");

    const popup = document.getElementById("popup");
    const popupTitle = document.getElementById("popup-title");
    const popupInstructions = document.getElementById("popup-instructions");
    const popupClose = document.getElementById("popup-close");

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
                popupTitle.textContent = app.supported ? app.name : `${app.name} (${app.alt})`;
                popupInstructions.textContent = app.install || "Kurulum bilgisi bulunamadı.";
                popup.classList.remove("hidden");
                popup.classList.add("visible");
            });

            appList.appendChild(card);
        });
    }

    searchInput.addEventListener("input", e => {
        renderApps(e.target.value);
    });

    popupClose.addEventListener("click", () => {
        popup.classList.remove("visible");
        popup.classList.add("hidden");
    });

    popup.addEventListener("click", (e) => {
        if (e.target === popup) {
            popup.classList.remove("visible");
            popup.classList.add("hidden");
        }
    });

    // Escape tuşu ile popup'ı kapatma
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && popup.classList.contains("visible")) {
            popup.classList.remove("visible");
            popup.classList.add("hidden");
        }
    });

    renderApps();
});
