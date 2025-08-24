// assest/js/script.js - Analytics entegrasyonlu güncellenmiş versiyon
// Linux App Hub - Sayfalama Sistemi ile Güncellenmiş + Analytics

window.initLinuxAppHub = function() {
    console.log('🚀 Linux App Hub başlatılıyor - Analytics ile güncellenmiş');
    
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

    // Analytics integration check
    const hasAnalytics = typeof window.AnalyticsSystem !== 'undefined';
    console.log('📊 Analytics sistem:', hasAnalytics ? 'Aktif' : 'Pasif');

    // Sayfalama ayarları
    const APPS_PER_PAGE = 10;
    let currentPage = 1;
    let showingAll = false;

    let currentFilters = {
        status: 'all',
        category: 'all',
        search: ''
    };

    // Basit kategori eşleştirme (Varsa external categories.js kullanılır)
    const APP_CATEGORIES = {
        // İletişim
        "Discord": "İletişim",
        "Telegram": "İletişim", 
        "WhatsApp": "İletişim",
        "TeamSpeak": "İletişim",
        "Zoom": "İletişim",
        "Skype": "İletişim",
        "Revolt": "İletişim",
        
        // Tarayıcılar
        "Google Chrome": "İnternet",
        "Mozilla Firefox": "İnternet",
        "Chromium": "İnternet",
        "Opera": "İnternet",
        "Brave": "İnternet",
        "Microsoft Edge": "İnternet",
        "LibreWolf": "İnternet",
        "Vivaldi": "İnternet",
        "Zen Browser": "İnternet",
        "Tor Browser": "İnternet",
        
        // Geliştirme
        "Visual Studio Code": "Geliştirme",
        "IntelliJ IDEA": "Geliştirme",
        "PyCharm": "Geliştirme",
        "Atom": "Geliştirme",
        "Sublime Text": "Geliştirme",
        "GitHub Desktop": "Geliştirme",
        "CLion": "Geliştirme",
        "WebStorm": "Geliştirme",
        "Rider": "Geliştirme",
        "Unity Hub": "Geliştirme",
        
        // Multimedya
        "VLC": "Multimedya",
        "Spotify": "Multimedya",
        "OBS Studio": "Multimedya",
        "Audacity": "Multimedya",
        "GIMP": "Multimedya",
        "Adobe Photoshop": "Multimedya",
        "Adobe Premiere Pro": "Multimedya",
        "Adobe Illustrator": "Multimedya",
        "Adobe Lightroom": "Multimedya",
        "Blender": "Multimedya",
        "TIDAL Hi-Fi": "Multimedya",
        "Krita": "Multimedya",
        "darktable": "Multimedya",
        "RawTherapee": "Multimedya",
        
        // Oyun
        "Steam": "Oyun",
        "Epic Games Launcher": "Oyun",
        "Heroic Games Launcher": "Oyun",
        "Minecraft": "Oyun",
        "Riot Games": "Oyun",
        
        // Ofis
        "LibreOffice": "Ofis",
        "Microsoft Office": "Ofis",
        "OnlyOffice": "Ofis",
        "Adobe Dreamweaver": "Ofis",
        "Figma Desktop": "Ofis",
        "Obsidian": "Ofis",
        "RemNote": "Ofis",
        
        // Sistem & Araçlar
        "VirtualBox": "Sistem",
        "VMware Workstation": "Sistem",
        "7-Zip": "Sistem",
        "WinRAR": "Sistem",
        "PeaZip": "Sistem",
        "AutoCAD": "Sistem",
        "FreeCAD": "Sistem",
        "LibreCAD": "Sistem",
        "Syncthing": "Sistem",
        "UBinary": "Sistem",
        "Scratch": "Sistem",
        
        // Güvenlik
        "1Password": "Güvenlik",
        "KeePass": "Güvenlik",
        "Bitwarden": "Güvenlik",
        "Proton VPN": "Güvenlik",
        
        // Uzaktan Erişim
        "TeamViewer": "Uzaktan Erişim",
        "AnyDesk": "Uzaktan Erişim",
        "RustDesk": "Uzaktan Erişim",
        
        // E-posta
        "Thunderbird": "E-posta",
        
        // Framework/Runtime
        "Electron": "Geliştirme",
        "Adobe AIR": "Geliştirme"
    };

    // Apps'e kategori ata
    function assignCategories() {
        console.log('📂 Kategoriler atanıyor...');
        
        apps.forEach(app => {
            let category = null;
            
            // 1. External categories.js varsa kullan
            if (typeof window.applyCategoriesTo === 'function') {
                // Bu durumda categories.js tarafından handle edilir
                return;
            }
            
            // 2. Direkt eşleşme
            if (APP_CATEGORIES[app.name]) {
                category = APP_CATEGORIES[app.name];
            }
            // 3. Kısmi eşleşme
            else {
                for (const [appName, cat] of Object.entries(APP_CATEGORIES)) {
                    if (app.name.toLowerCase().includes(appName.toLowerCase()) || 
                        appName.toLowerCase().includes(app.name.toLowerCase())) {
                        category = cat;
                        break;
                    }
                }
            }
            
            app.category = category || 'Diğer';
        });
        
        const categorized = apps.filter(app => app.category !== 'Diğer').length;
        console.log(`✅ ${categorized}/${apps.length} uygulama kategorize edildi`);
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

    // Kategori filtrelerini advanced search içine oluştur
    function initCategoryFilters() {
        console.log('🏷️ Kategori filtreleri oluşturuluyor (advanced search içinde)...');
        
        if (!advancedSearch) return;
        
        // Kategori filtreleri için yeni bir grup ekle
        let categoryFilterGroup = advancedSearch.querySelector('.category-filter-group');
        if (!categoryFilterGroup) {
            const searchFilters = advancedSearch.querySelector('.search-filters');
            if (searchFilters) {
                categoryFilterGroup = document.createElement('div');
                categoryFilterGroup.className = 'filter-group category-filter-group';
                
                const label = document.createElement('label');
                label.textContent = 'Kategori Filtresi:';
                
                const filterButtons = document.createElement('div');
                filterButtons.className = 'filter-buttons';
                filterButtons.id = 'category-filter-buttons';
                
                categoryFilterGroup.appendChild(label);
                categoryFilterGroup.appendChild(filterButtons);
                searchFilters.appendChild(categoryFilterGroup);
            }
        }
        
        const categoryButtons = document.getElementById('category-filter-buttons');
        if (!categoryButtons) return;
        
        categoryButtons.innerHTML = '';
        
        const categories = getCategories();
        const counts = getCategoryCounts();
        
        console.log('📊 Bulunan kategoriler:', categories);
        
        // Tümü butonu
        const allButton = document.createElement('button');
        allButton.className = 'filter-btn active';
        allButton.setAttribute('data-category', 'all');
        allButton.innerHTML = `Tümü <span class="count">(${apps.length})</span>`;
        allButton.addEventListener('click', () => filterByCategory('all'));
        categoryButtons.appendChild(allButton);
        
        // Kategori butonları
        categories.forEach(category => {
            const count = counts[category] || 0;
            if (count > 0) {
                const button = document.createElement('button');
                button.className = 'filter-btn';
                button.setAttribute('data-category', category);
                button.innerHTML = `${category} <span class="count">(${count})</span>`;
                button.addEventListener('click', () => filterByCategory(category));
                categoryButtons.appendChild(button);
            }
        });
        
        console.log(`✅ ${categories.length + 1} kategori butonu oluşturuldu (advanced search içinde)`);
    }

    // Ana sayfadaki kategori filtrelerini kaldır
    function removeCategoryFiltersFromMain() {
        const categoryFilters = document.getElementById('category-filters');
        if (categoryFilters) {
            categoryFilters.style.display = 'none';
            console.log('📋 Ana sayfadaki kategori filtreleri gizlendi');
        }
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
        resetPagination();
        renderApps();
    }

    function filterByCategory(category) {
        console.log('🔍 Kategori filtresi:', category);
        currentFilters.category = category;
        
        // Buton durumlarını güncelle (advanced search içindeki butonlar)
        document.querySelectorAll('#category-filter-buttons [data-category]').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.category === category);
        });
        
        resetPagination();
        renderApps();
    }

    // Sayfalamayı sıfırla
    function resetPagination() {
        currentPage = 1;
        showingAll = false;
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

    // "Daha fazla göster" butonunu oluştur
    function createShowMoreButton(filteredApps) {
        const showMoreBtn = document.createElement('div');
        showMoreBtn.className = 'show-more-container';
        showMoreBtn.style.cssText = `
            display: flex;
            justify-content: center;
            margin: 40px 0;
            grid-column: 1 / -1;
        `;
        
        const button = document.createElement('button');
        button.className = 'show-more-btn';
        button.textContent = `Daha Fazla Göster (${filteredApps.length - APPS_PER_PAGE} kaldı)`;
        button.style.cssText = `
            padding: 16px 32px;
            border: 2px solid var(--accent-primary);
            border-radius: 25px;
            background: var(--bg-secondary);
            backdrop-filter: var(--backdrop-blur);
            color: var(--accent-primary);
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 8px 24px var(--shadow-color);
        `;
        
        button.addEventListener('mouseenter', () => {
            button.style.background = 'var(--accent-primary)';
            button.style.color = 'white';
            button.style.transform = 'translateY(-2px) scale(1.05)';
            button.style.boxShadow = '0 12px 32px rgba(139, 92, 246, 0.4)';
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.background = 'var(--bg-secondary)';
            button.style.color = 'var(--accent-primary)';
            button.style.transform = 'translateY(0) scale(1)';
            button.style.boxShadow = '0 8px 24px var(--shadow-color)';
        });
        
        button.addEventListener('click', () => {
            showingAll = true;
            renderApps();
        });
        
        showMoreBtn.appendChild(button);
        return showMoreBtn;
    }

    // Uygulamaları render et (sayfalama ile) - Analytics entegrasyonlu
    function renderApps() {
        console.log('🎨 Apps render ediliyor... (sayfalama ile)');
        
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

        // Sayfalama logic'i
        let appsToShow = filteredApps;
        let shouldShowMoreButton = false;

        if (!showingAll && filteredApps.length > APPS_PER_PAGE) {
            appsToShow = filteredApps.slice(0, APPS_PER_PAGE);
            shouldShowMoreButton = true;
        }

        // Uygulamaları render et
        appsToShow.forEach((app, index) => {
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

            // Event listeners - Analytics entegrasyonlu
            if (app.supported) {
                const installBtn = card.querySelector('.install-btn');
                if (installBtn) {
                    installBtn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        
                        // Analytics tracking
                        if (hasAnalytics && window.AnalyticsSystem) {
                            window.AnalyticsSystem.trackAppView(app.name, 'install');
                        }
                        
                        showInstallPopup(app);
                    });
                }
            }

            const aboutBtn = card.querySelector('.about-btn');
            if (aboutBtn) {
                aboutBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    
                    // Analytics tracking
                    if (hasAnalytics && window.AnalyticsSystem) {
                        window.AnalyticsSystem.trackAppView(app.name, 'about');
                    }
                    
                    showAboutPopup(app);
                });
            }

            // Card click analytics - görüntüleme track'i
            card.addEventListener('click', () => {
                if (hasAnalytics && window.AnalyticsSystem) {
                    window.AnalyticsSystem.trackAppView(app.name, 'view');
                }
            });

            appList.appendChild(card);
        });

        // "Daha fazla göster" butonunu ekle
        if (shouldShowMoreButton) {
            const showMoreButton = createShowMoreButton(filteredApps);
            appList.appendChild(showMoreButton);
        }
        
        console.log(`✅ ${appsToShow.length}/${filteredApps.length} kart render edildi ${shouldShowMoreButton ? '(daha fazla göster butonu ile)' : ''}`);
    }

    // Kurulum popup'ını göster - Analytics entegrasyonlu
    function showInstallPopup(app) {
        if (!popup || !popupTitle || !popupInstructions) return;
        
        // Analytics tracking
        if (hasAnalytics && window.AnalyticsSystem) {
            window.AnalyticsSystem.trackAppView(app.name, 'install_popup_opened');
        }
        
        window.history.pushState({}, '', `#${app.name.toLowerCase().replace(/\s+/g, '-')}/p`);
        
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
                updateTabContentWithCopy(tabContent, app.install[distro]);
            });
            
            tabButtons.appendChild(button);
        });
        
        updateTabContentWithCopy(tabContent, app.install[firstDistro]);
        
        tabContainer.appendChild(tabButtons);
        tabContainer.appendChild(tabContent);
        popupInstructions.appendChild(tabContainer);
        
        popup.classList.remove("hidden");
        popup.classList.add("visible");
    }

    function updateTabContentWithCopy(tabContent, command) {
        if (!tabContent) return;
        
        tabContent.innerHTML = '';
        tabContent.textContent = command;
        
        const copyBtn = document.createElement('button');
        copyBtn.className = 'copy-btn';
        copyBtn.innerHTML = '📋';
        copyBtn.title = 'Kopyala';
        copyBtn.addEventListener('click', () => {
            copyToClipboard(command);
            
            // Analytics tracking
            if (hasAnalytics && window.AnalyticsSystem) {
                window.AnalyticsSystem.trackAppView('copy_command', 'action');
            }
        });
        
        tabContent.appendChild(copyBtn);
    }

    // Hakkında popup'ını göster - Analytics entegrasyonlu
    function showAboutPopup(app) {
        if (!popup || !popupTitle || !popupInstructions) return;
        
        // Analytics tracking
        if (hasAnalytics && window.AnalyticsSystem) {
            window.AnalyticsSystem.trackAppView(app.name, 'about_popup_opened');
        }
        
        window.history.pushState({}, '', `#${app.name.toLowerCase().replace(/\s+/g, '-')}/h`);
        
        if (app.supported) {
            popupTitle.textContent = `${app.name} - Hakkında`;
            popupInstructions.innerHTML = '';
            
            const tabContainer = document.createElement('div');
            const tabButtons = document.createElement('div');
            tabButtons.className = 'tab-buttons';
            
            const tabContent = document.createElement('div');
            tabContent.className = 'tab-content about-content';
            
            const screenshotBtn = document.createElement('button');
            screenshotBtn.className = 'tab-button active';
            screenshotBtn.textContent = 'Ekran Görüntüsü';
            
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
                
                const screenshotBtn = document.createElement('button');
                screenshotBtn.className = 'tab-button active';
                screenshotBtn.textContent = 'Ekran Görüntüsü';
                
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

    // Global popup functions for Analytics System
    window.showAppPopup = function(app, type) {
        if (type === 'install' && app.supported) {
            showInstallPopup(app);
        } else {
            showAboutPopup(app);
        }
    };

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
            resetPagination();
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
            // Popüler uygulamalar popup'ını da kapat
            else if (hasAnalytics && window.AnalyticsSystem) {
                window.AnalyticsSystem.closePopularAppsPopup();
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

    // Analytics event listeners
    if (hasAnalytics) {
        console.log('📊 Analytics event listeners ekleniyor...');
        
        // Popular apps updated event
        window.addEventListener('popularAppsUpdated', (e) => {
            console.log('📊 Popüler uygulamalar güncellendi:', e.detail.popularApps.length);
        });
        
        // Page visibility change tracking
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                console.log('📊 Sayfa gizlendi');
            } else {
                console.log('📊 Sayfa görünür hale geldi');
                if (window.AnalyticsSystem) {
                    // Sayfaya geri dönüldüğünde popüler uygulamaları güncelle
                    setTimeout(() => {
                        if (typeof window.AnalyticsSystem.calculatePopularApps === 'function') {
                            window.AnalyticsSystem.calculatePopularApps();
                        }
                    }, 1000);
                }
            }
        });
    }

    // Başlat
    console.log('🚀 Sistem başlatılıyor...');
    
    initTheme();
    assignCategories();
    removeCategoryFiltersFromMain(); // Ana sayfadaki kategori filtrelerini kaldır
    initCategoryFilters(); // Advanced search içine ekle
    renderApps();
    
    // Animasyonlu istatistikler
    setTimeout(() => {
        updateStats();
    }, 300);

    // URL hash kontrolü
    checkHashOnLoad();
    
    // Analytics integration check and setup
    if (hasAnalytics) {
        console.log('✅ Analytics entegrasyonu aktif');
        
        // Örnek veri oluştur (development için)
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            setTimeout(() => {
                console.log('🧪 Development mode - Örnek analytics verisi oluşturuluyor...');
                const sampleApps = ['Discord', 'Visual Studio Code', 'Spotify', 'Steam', 'Google Chrome'];
                sampleApps.forEach((appName, index) => {
                    setTimeout(() => {
                        if (window.AnalyticsSystem) {
                            // Farklı tipte etkileşimler simüle et
                            window.AnalyticsSystem.trackAppView(appName, 'view');
                            if (index % 2 === 0) {
                                window.AnalyticsSystem.trackAppView(appName, 'about');
                            }
                            if (index % 3 === 0) {
                                window.AnalyticsSystem.trackAppView(appName, 'install');
                            }
                        }
                    }, index * 200);
                });
            }, 2000);
        }
    } else {
        console.log('⚠️ Analytics sistemi yüklenemedi - temel fonksiyonalite devam ediyor');
    }
    
    console.log('✅ Linux App Hub hazır! (Analytics entegrasyonlu)');
};
