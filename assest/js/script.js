// Linux App Hub - Basitleştirilmiş Kategori Sistemi
// Karmaşık sistem yerine direkt apps.js'de kategori tanımlama

window.initLinuxAppHub = function() {
    console.log('🚀 Linux App Hub başlatılıyor - Basit kategori sistemi');
    
    // DOM elementlerini güvenli şekilde al
    function safeGetElement(id) {
        const element = document.getElementById(id);
        if (!element) {
            console.warn(`⚠️ Element bulunamadı: #${id}`);
        }
        return element;
    }

    // DOM elementleri
    const appList = safeGetElement("app-list");
    const searchInput = safeGetElement("search");
    const advancedToggle = safeGetElement("advanced-toggle");
    const advancedSearch = safeGetElement("advanced-search");
    const categoryFilters = safeGetElement("category-filters");
    const themeToggle = safeGetElement("theme-toggle");
    const toast = safeGetElement("toast");
    const popup = safeGetElement("popup");
    const popupTitle = safeGetElement("popup-title");
    const popupInstructions = safeGetElement("popup-instructions");
    const popupClose = safeGetElement("popup-close");
    const supportedCount = safeGetElement("supported-count");
    const unsupportedCount = safeGetElement("unsupported-count");
    const totalCount = safeGetElement("total-count");

    // Veri kontrolü
    if (typeof apps === 'undefined' || !Array.isArray(apps)) {
        console.error('❌ apps verisi bulunamadı!');
        if (appList) {
            appList.innerHTML = '<div class="error-message">Uygulama verileri yüklenemedi. Lütfen sayfayı yenileyin.</div>';
        }
        return;
    }

    console.log(`📊 ${apps.length} uygulama yüklendi`);

    let currentFilters = {
        status: 'all',
        category: 'all',
        search: ''
    };

    // Basit kategori eşleştirme - Bu listeyi apps.js'inizdeki uygulamalara göre ayarlayın
    const APP_CATEGORIES = {
        // İletişim
        "Discord": "İletişim",
        "Telegram": "İletişim", 
        "WhatsApp": "İletişim",
        "TeamSpeak": "İletişim",
        "Zoom": "İletişim",
        "Skype": "İletişim",
        
        // Tarayıcılar
        "Google Chrome": "İnternet",
        "Mozilla Firefox": "İnternet",
        "Chromium": "İnternet",
        "Opera": "İnternet",
        "Brave": "İnternet",
        "Microsoft Edge": "İnternet",
        
        // Geliştirme
        "Visual Studio Code": "Geliştirme",
        "IntelliJ IDEA": "Geliştirme",
        "PyCharm": "Geliştirme",
        "Atom": "Geliştirme",
        "Sublime Text": "Geliştirme",
        "GitHub Desktop": "Geliştirme",
        
        // Multimedya
        "VLC": "Multimedya",
        "Spotify": "Multimedya",
        "OBS Studio": "Multimedya",
        "Audacity": "Multimedya",
        "GIMP": "Multimedya",
        
        // Oyun
        "Steam": "Oyun",
        "Epic Games": "Oyun",
        "Minecraft": "Oyun",
        
        // Ofis
        "LibreOffice": "Ofis",
        "Microsoft Office": "Ofis",
        "OnlyOffice": "Ofis",
        
        // Sistem
        "VirtualBox": "Sistem",
        "VMware": "Sistem",
        "7-Zip": "Sistem",
        "WinRAR": "Sistem"
    };

    // Apps'e kategori ata - BASİT YÖNTEM
    function assignCategories() {
        console.log('📂 Kategoriler atanıyor...');
        
        apps.forEach(app => {
            // Kategoriyi bul
            let category = null;
            
            // 1. Direkt eşleşme
            if (APP_CATEGORIES[app.name]) {
                category = APP_CATEGORIES[app.name];
            }
            // 2. Kısmi eşleşme
            else {
                for (const [appName, cat] of Object.entries(APP_CATEGORIES)) {
                    if (app.name.toLowerCase().includes(appName.toLowerCase()) || 
                        appName.toLowerCase().includes(app.name.toLowerCase())) {
                        category = cat;
                        break;
                    }
                }
            }
            
            // 3. Varsayılan kategori
            app.category = category || 'Diğer';
        });
        
        // Sonuçları logla
        const categorized = apps.filter(app => app.category !== 'Diğer').length;
        console.log(`✅ ${categorized}/${apps.length} uygulama kategorize edildi`);
        
        // İlk 10 uygulamanın kategorilerini göster
        console.log('📋 İlk 10 uygulamanın kategorileri:');
        apps.slice(0, 10).forEach(app => {
            console.log(`  - ${app.name}: ${app.category}`);
        });
    }

    // Mevcut kategorileri çıkar
    function getCategories() {
        const categories = new Set();
        apps.forEach(app => {
            if (app.category) {
                categories.add(app.category);
            }
        });
        return Array.from(categories).sort();
    }

    // Kategori sayılarını hesapla
    function getCategoryCounts() {
        const counts = {};
        apps.forEach(app => {
            const category = app.category || 'Diğer';
            counts[category] = (counts[category] || 0) + 1;
        });
        return counts;
    }

    // Kategori filtrelerini oluştur
    function initCategoryFilters() {
        console.log('🏷️ Kategori filtreleri oluşturuluyor...');
        
        if (!categoryFilters) return;
        
        categoryFilters.innerHTML = '';
        
        const categories = getCategories();
        const counts = getCategoryCounts();
        
        console.log('📊 Bulunan kategoriler:', categories);
        console.log('📊 Kategori sayıları:', counts);
        
        // Tümü butonu
        const allButton = document.createElement('button');
        allButton.className = 'filter-btn active';
        allButton.setAttribute('data-category', 'all');
        allButton.innerHTML = `Tümü <span class="count">(${apps.length})</span>`;
        allButton.addEventListener('click', () => filterByCategory('all'));
        categoryFilters.appendChild(allButton);
        
        // Kategori butonları
        categories.forEach(category => {
            const count = counts[category] || 0;
            if (count > 0) {
                const button = document.createElement('button');
                button.className = 'filter-btn';
                button.setAttribute('data-category', category);
                button.innerHTML = `${category} <span class="count">(${count})</span>`;
                button.addEventListener('click', () => filterByCategory(category));
                categoryFilters.appendChild(button);
            }
        });
        
        console.log(`✅ ${categories.length + 1} kategori butonu oluşturuldu`);
    }

    // Tema yönetimi
    function initTheme() {
        const savedTheme = localStorage.getItem('theme') || 'dark';
        document.documentElement.setAttribute('data-theme', savedTheme);
        updateThemeIcon(savedTheme);
    }

    function toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    }

    function updateThemeIcon(theme) {
        if (!themeToggle) return;
        const themeIcon = themeToggle.querySelector('.theme-icon');
        if (themeIcon) {
            themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
            themeToggle.title = theme === 'dark' ? 'Açık Tema' : 'Koyu Tema';
        }
    }

    // Toast bildirim
    function showToast(message, icon = '✅') {
        if (!toast) return;
        const toastIcon = toast.querySelector('.toast-icon');
        const toastMessage = toast.querySelector('.toast-message');
        if (toastIcon) toastIcon.textContent = icon;
        if (toastMessage) toastMessage.textContent = message;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3000);
    }

    // Panoya kopyala
    async function copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            showToast('Komut kopyalandı!', '📋');
        } catch (err) {
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.opacity = '0';
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            showToast('Komut kopyalandı!', '📋');
        }
    }

    // Filtreleme fonksiyonları
    function filterByStatus(status) {
        console.log('🔍 Durum filtresi:', status);
        currentFilters.status = status;
        document.querySelectorAll('[data-filter]').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.filter === status);
        });
        renderApps();
    }

    function filterByCategory(category) {
        console.log('🔍 Kategori filtresi:', category);
        currentFilters.category = category;
        
        // Buton durumlarını güncelle
        document.querySelectorAll('[data-category]').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.category === category);
        });
        
        renderApps();
    }

    // Filtrelenmiş uygulamaları al
    function getFilteredApps() {
        console.log('🔍 Filtreleme yapılıyor:', currentFilters);
        
        let filtered = apps.slice();
        
        // Arama filtresi
        if (currentFilters.search) {
            const searchTerm = currentFilters.search.toLowerCase();
            filtered = filtered.filter(app => {
                const searchText = [
                    app.name,
                    app.description || '',
                    app.category || ''
                ].join(' ').toLowerCase();
                return searchText.includes(searchTerm);
            });
        }
        
        // Durum filtresi
        if (currentFilters.status !== 'all') {
            switch (currentFilters.status) {
                case 'supported':
                    filtered = filtered.filter(app => app.supported);
                    break;
                case 'alternatives':
                    filtered = filtered.filter(app => !app.supported && app.alternatives?.length > 0);
                    break;
                case 'unsupported':
                    filtered = filtered.filter(app => !app.supported && (!app.alternatives || app.alternatives.length === 0));
                    break;
            }
        }
        
        // Kategori filtresi
        if (currentFilters.category !== 'all') {
            filtered = filtered.filter(app => app.category === currentFilters.category);
        }
        
        console.log(`📋 Filtreleme sonucu: ${filtered.length} uygulama`);
        return filtered;
    }

    // İstatistikleri güncelle
    function updateStats(filteredApps = apps) {
        const supported = filteredApps.filter(app => app.supported).length;
        const unsupported = filteredApps.filter(app => !app.supported).length;
        const total = filteredApps.length;

        if (supportedCount) animateNumber(supportedCount, supported);
        if (unsupportedCount) animateNumber(unsupportedCount, unsupported);
        if (totalCount) animateNumber(totalCount, total);
    }

    function animateNumber(element, targetValue) {
        if (!element) return;
        const startValue = parseInt(element.textContent) || 0;
        const duration = 500;
        const startTime = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const currentValue = Math.floor(startValue + (targetValue - startValue) * progress);
            element.textContent = currentValue;
            if (progress < 1) requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
    }

    // Uygulamaları render et
    function renderApps() {
        console.log('🎨 Apps render ediliyor...');
        
        if (!appList) return;
        
        appList.innerHTML = "";
        const filteredApps = getFilteredApps();
        
        // Alfabetik sıralama
        filteredApps.sort((a, b) => a.name.localeCompare(b.name, 'tr'));
        
        updateStats(filteredApps);

        if (filteredApps.length === 0) {
            appList.innerHTML = `
                <div class="no-results">
                    <div class="no-results-icon">🔍</div>
                    <h3>Sonuç bulunamadı</h3>
                    <p>Filtreler: Kategori="${currentFilters.category}", Durum="${currentFilters.status}", Arama="${currentFilters.search}"</p>
                </div>
            `;
            return;
        }

        filteredApps.forEach((app, index) => {
            const card = document.createElement("div");
            card.className = "card";
            card.style.animationDelay = `${index * 0.1}s`;

            // Icon
            const iconElement = app.icon ? 
                `<img src="${app.icon}" alt="${app.name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">` 
                : '';
            const fallbackIcon = `<div class="card-icon" ${iconElement ? 'style="display:none;"' : ''}>${app.name.charAt(0).toUpperCase()}</div>`;

            // Status
            let statusClass = "green", statusText = "Destekleniyor", statusIcon = "✓";
            if (!app.supported) {
                if (app.alternatives?.length > 0) {
                    statusClass = "orange";
                    statusText = "Alternatifler Mevcut";
                    statusIcon = "⚠";
                } else {
                    statusClass = "red";
                    statusText = "Desteklenmiyor";
                    statusIcon = "✗";
                }
            }

            const categoryDisplay = app.category ? `<div class="app-category">${app.category}</div>` : '';

            card.innerHTML = `
                <div class="card-header">
                    ${iconElement}
                    ${fallbackIcon}
                    <div class="card-info">
                        <div class="app-name">${app.name}</div>
                        ${categoryDisplay}
                        <div class="status ${statusClass}">
                            <span class="status-icon">${statusIcon}</span>
                            ${statusText}
                        </div>
                    </div>
                </div>
                <div class="card-actions">
                    ${app.supported ? `<button class="action-btn install-btn" data-action="install" title="Kurulum Talimatları">📦</button>` : ''}
                    <button class="action-btn about-btn" data-action="about" title="${app.supported ? 'Hakkında' : (app.alternatives ? 'Alternatifler' : 'Neden Desteklenmiyor?')}">ℹ️</button>
                </div>
            `;

            // Event listeners - butonlara tıklama olayları
            if (app.supported) {
                const installBtn = card.querySelector('.install-btn');
                if (installBtn) {
                    installBtn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        showInstallPopup(app);
                    });
                }
            }

            const aboutBtn = card.querySelector('.about-btn');
            if (aboutBtn) {
                aboutBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    showAboutPopup(app);
                });
            }

            appList.appendChild(card);
        });
        
        console.log(`✅ ${filteredApps.length} kart render edildi`);
    }

    // Kurulum popup'ını göster
    function showInstallPopup(app) {
        if (!popup || !popupTitle || !popupInstructions) return;
        
        // URL hash güncelle
        window.history.pushState({}, '', `#${app.name.toLowerCase().replace(/\s+/g, '-')}/p`);
        
        popupTitle.textContent = `${app.name} - Kurulum`;
        popupInstructions.innerHTML = '';
        
        const tabContainer = document.createElement('div');
        const tabButtons = document.createElement('div');
        tabButtons.className = 'tab-buttons';
        
        const tabContent = document.createElement('div');
        tabContent.className = 'tab-content';
        
        let firstDistro = Object.keys(app.install)[0];
        
        // Dağıtım sekmelerini oluştur
        Object.keys(app.install).forEach((distro, index) => {
            const button = document.createElement('button');
            button.className = `tab-button ${index === 0 ? 'active' : ''}`;
            button.textContent = distro;
            
            button.addEventListener('click', () => {
                tabButtons.querySelectorAll('.tab-button').forEach(btn => 
                    btn.classList.remove('active')
                );
                button.classList.add('active');
                updateTabContentWithCopy(tabContent, app.install[distro]);
            });
            
            tabButtons.appendChild(button);
        });
        
        // İlk sekmenin içeriğini göster
        updateTabContentWithCopy(tabContent, app.install[firstDistro]);
        
        tabContainer.appendChild(tabButtons);
        tabContainer.appendChild(tabContent);
        popupInstructions.appendChild(tabContainer);
        
        popup.classList.remove("hidden");
        popup.classList.add("visible");
    }

    // Tab içeriğini kopyalama butonu ile güncelle
    function updateTabContentWithCopy(tabContent, command) {
        if (!tabContent) return;
        
        tabContent.innerHTML = '';
        tabContent.textContent = command;
        
        // Kopyala butonu ekle
        const copyBtn = document.createElement('button');
        copyBtn.className = 'copy-btn';
        copyBtn.innerHTML = '📋';
        copyBtn.title = 'Kopyala';
        copyBtn.addEventListener('click', () => {
            copyToClipboard(command);
        });
        
        tabContent.appendChild(copyBtn);
    }

    // Hakkında popup'ını göster
    function showAboutPopup(app) {
        if (!popup || !popupTitle || !popupInstructions) return;
        
        // URL hash güncelle
        window.history.pushState({}, '', `#${app.name.toLowerCase().replace(/\s+/g, '-')}/h`);
        
        if (app.supported) {
            // Desteklenen uygulama
            popupTitle.textContent = `${app.name} - Hakkında`;
            popupInstructions.innerHTML = '';
            
            const tabContainer = document.createElement('div');
            const tabButtons = document.createElement('div');
            tabButtons.className = 'tab-buttons';
            
            const tabContent = document.createElement('div');
            tabContent.className = 'tab-content about-content';
            
            // Ekran görüntüsü sekmesi
            const screenshotBtn = document.createElement('button');
            screenshotBtn.className = 'tab-button active';
            screenshotBtn.textContent = 'Ekran Görüntüsü';
            
            // Web sitesi sekmesi
            const websiteBtn = document.createElement('button');
            websiteBtn.className = 'tab-button';
            websiteBtn.textContent = 'Web Sitesi';
            
            screenshotBtn.addEventListener('click', () => {
                tabButtons.querySelectorAll('.tab-button').forEach(btn => 
                    btn.classList.remove('active')
                );
                screenshotBtn.classList.add('active');
                
                tabContent.innerHTML = '<div class="loading-message">Yükleniyor...</div>';
                
                const img = new Image();
                img.onload = function() {
                    tabContent.innerHTML = `<img src="${app.about.screenshot}" alt="${app.name} ekran görüntüsü" class="screenshot">`;
                };
                img.onerror = function() {
                    tabContent.innerHTML = '<div class="error-message">Görsel yüklenemedi</div>';
                };
                img.src = app.about.screenshot;
            });
            
            websiteBtn.addEventListener('click', () => {
                tabButtons.querySelectorAll('.tab-button').forEach(btn => 
                    btn.classList.remove('active')
                );
                websiteBtn.classList.add('active');
                tabContent.innerHTML = `<a href="${app.about.website}" target="_blank" class="website-link">🌐 ${app.about.website}</a>`;
            });
            
            tabButtons.appendChild(screenshotBtn);
            tabButtons.appendChild(websiteBtn);
            
            // Varsayılan ekran görüntüsü
            tabContent.innerHTML = '<div class="loading-message">Yükleniyor...</div>';
            const img = new Image();
            img.onload = function() {
                tabContent.innerHTML = `<img src="${app.about.screenshot}" alt="${app.name} ekran görüntüsü" class="screenshot">`;
            };
            img.onerror = function() {
                tabContent.innerHTML = '<div class="error-message">Görsel yüklenemedi</div>';
            };
            img.src = app.about.screenshot;
            
            tabContainer.appendChild(tabButtons);
            tabContainer.appendChild(tabContent);
            popupInstructions.appendChild(tabContainer);
            
        } else if (app.alternatives && app.alternatives.length > 0) {
            // Alternatifleri olan uygulama
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
                
                // Ekran görüntüsü sekmesi
                const screenshotBtn = document.createElement('button');
                screenshotBtn.className = 'tab-button active';
                screenshotBtn.textContent = 'Ekran Görüntüsü';
                
                // Web sitesi sekmesi
                const websiteBtn = document.createElement('button');
                websiteBtn.className = 'tab-button';
                websiteBtn.textContent = 'Web Sitesi';
                
                let imageLoaded = false;
                
                screenshotBtn.addEventListener('click', () => {
                    tabButtons.querySelectorAll('.tab-button').forEach(btn => 
                        btn.classList.remove('active')
                    );
                    screenshotBtn.classList.add('active');
                    
                    if (!imageLoaded) {
                        tabContent.innerHTML = '<div class="loading-message">Yükleniyor...</div>';
                        const img = new Image();
                        img.onload = function() {
                            tabContent.innerHTML = `<img src="${alt.screenshot}" alt="${alt.name} ekran görüntüsü" class="screenshot">`;
                            imageLoaded = true;
                        };
                        img.onerror = function() {
                            tabContent.innerHTML = '<div class="error-message">Görsel yüklenemedi</div>';
                        };
                        img.src = alt.screenshot;
                    } else {
                        tabContent.innerHTML = `<img src="${alt.screenshot}" alt="${alt.name} ekran görüntüsü" class="screenshot">`;
                    }
                });
                
                websiteBtn.addEventListener('click', () => {
                    tabButtons.querySelectorAll('.tab-button').forEach(btn => 
                        btn.classList.remove('active')
                    );
                    websiteBtn.classList.add('active');
                    tabContent.innerHTML = `<a href="${alt.website}" target="_blank" class="website-link">🌐 ${alt.website}</a>`;
                });
                
                tabButtons.appendChild(screenshotBtn);
                tabButtons.appendChild(websiteBtn);
                
                // Varsayılan görsel
                tabContent.innerHTML = '<div class="loading-message">Yükleniyor...</div>';
                const img = new Image();
                img.onload = function() {
                    tabContent.innerHTML = `<img src="${alt.screenshot}" alt="${alt.name} ekran görüntüsü" class="screenshot">`;
                    imageLoaded = true;
                };
                img.onerror = function() {
                    tabContent.innerHTML = '<div class="error-message">Görsel yüklenemedi</div>';
                };
                img.src = alt.screenshot;
                
                tabContainer.appendChild(tabButtons);
                tabContainer.appendChild(tabContent);
                altContainer.appendChild(altHeader);
                altContainer.appendChild(tabContainer);
                popupInstructions.appendChild(altContainer);
            });
            
        } else {
            // Desteklenmeyen uygulama
            popupTitle.textContent = `${app.name} - Desteklenmeme Sebebi`;
            popupInstructions.innerHTML = '';
            
            const tabContainer = document.createElement('div');
            const tabButtons = document.createElement('div');
            tabButtons.className = 'tab-buttons';
            
            const tabContent = document.createElement('div');
            tabContent.className = 'tab-content reason-content';
            
            const reasonBtn = document.createElement('button');
            reasonBtn.className = 'tab-button active';
            reasonBtn.textContent = 'Desteklenmeme Sebebi';
            
            tabButtons.appendChild(reasonBtn);
            tabContent.innerHTML = `<p>${app.unsupportedReason}</p>`;
            
            if (app.about && app.about.website) {
                tabContent.innerHTML += `<br><a href="${app.about.website}" target="_blank" class="website-link">🌐 Resmi Web Sitesi</a>`;
            }
            
            tabContainer.appendChild(tabButtons);
            tabContainer.appendChild(tabContent);
            popupInstructions.appendChild(tabContainer);
        }
        
        popup.classList.remove("hidden");
        popup.classList.add("visible");
    }

    // URL hash kontrolü
    function checkHashOnLoad() {
        const hash = window.location.hash.substring(1);
        if (hash) {
            const parts = hash.split('/');
            const appName = parts[0].replace(/-/g, ' ');
            const action = parts[1];
            
            const app = apps.find(a => a.name.toLowerCase() === appName.toLowerCase());
            if (app) {
                setTimeout(() => {
                    if (action === 'p' && app.supported) {
                        showInstallPopup(app);
                    } else if (action === 'h' || !app.supported) {
                        showAboutPopup(app);
                    } else if (!action) {
                        if (app.supported) {
                            showInstallPopup(app);
                        } else {
                            showAboutPopup(app);
                        }
                    }
                }, 500);
            }
        }
    }

    // Event listeners
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }

    if (advancedToggle && advancedSearch) {
        advancedToggle.addEventListener('click', () => {
            advancedSearch.classList.toggle('active');
        });
    }

    if (searchInput) {
        searchInput.addEventListener("input", e => {
            currentFilters.search = e.target.value;
            renderApps();
        });
    }

    // Durum filtresi butonları
    document.querySelectorAll('[data-filter]').forEach(btn => {
        btn.addEventListener('click', () => {
            filterByStatus(btn.dataset.filter);
        });
    });

    // Popup kapatma olayları
    if (popupClose && popup) {
        popupClose.addEventListener("click", () => {
            popup.classList.remove("visible");
            popup.classList.add("hidden");
            window.history.pushState({}, '', window.location.pathname);
        });

        popup.addEventListener("click", (e) => {
            if (e.target === popup) {
                popup.classList.remove("visible");
                popup.classList.add("hidden");
                window.history.pushState({}, '', window.location.pathname);
            }
        });
    }

    // Klavye olayları
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            if (advancedSearch && advancedSearch.classList.contains('active')) {
                advancedSearch.classList.remove('active');
            } else if (popup && popup.classList.contains("visible")) {
                popup.classList.remove("visible");
                popup.classList.add("hidden");
                window.history.pushState({}, '', window.location.pathname);
            }
        }
    });

    // Browser geri/ileri butonları
    window.addEventListener('popstate', () => {
        if (popup && popup.classList.contains('visible')) {
            popup.classList.remove("visible");
            popup.classList.add("hidden");
        }
        checkHashOnLoad();
    });

    // Başlat
    console.log('🚀 Sistem başlatılıyor...');
    
    initTheme();
    assignCategories();  // ← Bu çok önemli!
    initCategoryFilters();
    renderApps();
    
    // Animasyonlu istatistikler
    setTimeout(() => {
        updateStats();
    }, 300);

    // URL hash kontrolü
    checkHashOnLoad();
    
    console.log('✅ Linux App Hub hazır!');
};
