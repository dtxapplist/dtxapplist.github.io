document.addEventListener("DOMContentLoaded", () => {
    const appList = document.getElementById("app-list");
    const searchInput = document.getElementById("search");

    function renderApps(filter = "") {
        appList.innerHTML = "";

        apps
            .filter(app => app.name.toLowerCase().includes(filter.toLowerCase()))
            .forEach(app => {
                const card = document.createElement("div");
                card.className = "card";

                card.innerHTML = `
                    <img src="${app.icon}" alt="${app.name}">
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

                appList.appendChild(card);
            });
    }

    searchInput.addEventListener("input", e => {
        renderApps(e.target.value);
    });

    renderApps();
});
