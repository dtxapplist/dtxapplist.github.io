// Linux App Hub Ana Script Dosyası - Güvenli Versiyon
// Null check'ler eklendi

window.initLinuxAppHub = function() {
    console.log('🚀 Linux App Hub başlatılıyor...');
    
    // DOM elementlerini güvenli şekilde al
    function safeGetElement(id) {
        const element = document.getElementById(id);
        if (!element) {
            console.warn(`⚠️ Element bulunamadı: #${id}`);
        }
        return element;
    }

    // DOM elementlerini al
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

    // Stats elements
    const supportedCount = safeGetElement("supported-count");
    const unsupportedCount = safeGetElement("unsupported-count");
    const totalCount = safeGetElement("total-count");

    // apps.js'den gelen veri kontrolü
    if (typeof apps === 'undefined' || !Array.isArray(apps)) {
        console.error('❌ apps verisi bulunamadı! apps.js dosyası doğru yüklendi mi?');
        if (appList) {
            appList.innerHTML = '<div class="error-message">Uygulama verileri yüklenemedi. Lütfen sayfayı yenileyin.</div>';
        }
        return;
    }

    console.log(`📊 ${apps.length} uygulama verisi yüklendi`);

    let currentApp = null;
    let currentFilters = {
        status: 'all',
        category: 'all',
        search: ''
    };

    // Theme management
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

    // Toast notification
    function showToast(message, icon = '✅') {
        if (!toast) return;
        
        const toastIcon = toast.querySelector('.toast-icon');
        const toastMessage = toast.querySelector('.toast-message');
        
        if (toastIcon) toastIcon.textContent = icon;
        if (toastMessage) toastMessage.textContent = message;
        
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    // Copy to clipboard
    async function copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            showToast('Komut kopyalandı!', '📋');
        } catch (err) {
            // Fallback for older browsers
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

    // Extract categories from apps data (düzeltilmiş versiyon)
    function getAvailableCategories() {
        // Önce global fonksiyonu kontrol et
        if (typeof window.getAvailableCategories === 'function') {
            try {
                return window.getAvailableCategories();
            } catch (error) {
                console.warn('⚠️ Global getAvailableCategories fonksiyonu hata verdi:', error);
            }
        }
        
        // Fallback: apps verisinden kategorileri çıkar
        console.log('📂 Fallback kategori çıkarma kullanılıyor');
        const categories = new Set();
        apps.forEach(app => {
            if (app.category) {
                categories.add(app.category);
            }
        });
        
        const categoryArray = Array.from(categories).sort((a, b) => a.localeCompare(b, 'tr', { sensitivity: 'base' }));
        console.log('📂 Çıkarılan kategoriler:', categoryArray);
        return categoryArray;
    }

    // Initialize category filters (düzeltilmiş versiyon)
    function initCategoryFilters() {
        console.log('🏷️ Kategori filtreleri başlatılıyor...');
        
        if (!categoryFilters) {
            console.error('❌ categoryFilters DOM elementi bulunamadı!');
            return;
        }

        // Mevcut kategori butonlarını temizle (Tümü hariç)
        const existingButtons = categoryFilters.querySelectorAll('[data-category]:not([data-category="all"])');
        existingButtons.forEach(btn => btn.remove());
        
        const categories = getAvailableCategories();
        console.log('📂 Bulunan kategoriler:', categories);
        
        // Kategori sayılarını hesapla
        let categoryCounts = {};
        if (typeof window.getCategoryCounts === 'function') {
            try {
                categoryCounts = window.getCategoryCounts(apps);
            } catch (error) {
                console.warn('⚠️ Global getCategoryCounts fonksiyonu hata verdi:', error);
            }
        }
        
        // Fallback: manuel hesaplama
        if (Object.keys(categoryCounts).length === 0) {
            console.log('📊 Fallback kategori sayım kullanılıyor');
            apps.forEach(app => {
                const category = app.category || 'Diğer';
                categoryCounts[category] = (categoryCounts[category] || 0) + 1;
            });
        }
        
        console.log('📊 Kategori sayıları:', categoryCounts);
        
        // "Tümü" butonu zaten var mı kontrol et
        let allButton = categoryFilters.querySelector('[data-category="all"]');
        if (!allButton) {
            allButton = document.createElement('button');
            allButton.className = 'filter-btn active';
            allButton.setAttribute('data-category', 'all');
            allButton.addEventListener('click', () => filterByCategory('all'));
            categoryFilters.appendChild(allButton);
        }
        
        // "Tümü" butonunu güncelle
        allButton.innerHTML = `Tümü <span class="count">(${apps.length})</span>`;
        
        // Diğer kategorileri ekle
        categories.forEach((category, index) => {
            const count = categoryCounts[category] || 0;
            if (count > 0) {
                const button = document.createElement('button');
                button.className = 'filter-btn';
                button.setAttribute('data-category', category.toLowerCase().replace(/\s+/g, '-'));
                button.innerHTML = `${category} <span class="count">(${count})</span>`;
                button.style.setProperty('--index', index);
                button.addEventListener('click', () => filterByCategory(category));
                categoryFilters.appendChild(button);
            }
        });
        
        console.log(`✅ ${categories.length} kategori filtresi oluşturuldu`);
    }

    // Filter functions
    function filterByStatus(status) {
        currentFilters.status = status;
        
        // Update button states
        document.querySelectorAll('[data-filter]').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.filter === status);
        });
        
        renderApps();
    }

    function filterByCategory(category) {
        console.log('🔍 Kategori filtresi uygulanıyor:', category);
        currentFilters.category = category;
        
        // Update button states
        document.querySelectorAll('[data-category]').forEach(btn => {
            const btnCategory = btn.dataset.category;
            const isActive = (category === 'all' && btnCategory === 'all') || 
                           (category !== 'all' && btnCategory === category.toLowerCase().replace(/\s+/g, '-'));
            btn.classList.toggle('active', isActive);
        });
        
        renderApps();
    }

    function updateStats(filteredApps = apps) {
        const supported = filteredApps.filter(app => app.supported).length;
        const unsupported = filteredApps.filter(app => !app.supported).length;
        const total = filteredApps.length;

        // Animated counter effect
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

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }

        requestAnimationFrame(update);
    }

    function getFilteredApps() {
        let filteredApps = apps.slice();

        // Search filter
        if (currentFilters.search) {
            const searchTerm = currentFilters.search.toLowerCase();
            filteredApps = filteredApps.filter(app => {
                const searchableText = [
                    app.name,
                    app.description || '',
                    app.category || '',
                    ...(app.tags || [])
                ].join(' ').toLowerCase();
                
                return searchableText.includes(searchTerm);
            });
        }

        // Status filter
        if (currentFilters.status !== 'all') {
            switch (currentFilters.status) {
                case 'supported':
                    filteredApps = filteredApps.filter(app => app.supported);
                    break;
                case 'alternatives':
                    filteredApps = filteredApps.filter(app => !app.supported && app.alternatives && app.alternatives.length > 0);
                    break;
                case 'unsupported':
                    filteredApps = filteredApps.filter(app => !app.supported && (!app.alternatives || app.alternatives.length === 0));
                    break;
            }
        }

        // Category filter - DÜZELTİLDİ
        if (currentFilters.category !== 'all') {
            console.log('🔍 Kategori filtresi uygulanıyor:', currentFilters.category);
            const beforeCount = filteredApps.length;
            filteredApps = filteredApps.filter(app => {
                const appCategory = app.category || 'Diğer';
                const matches = appCategory === currentFilters.category;
                if (!matches) {
                    console.log(`❌ ${app.name}: "${appCategory}" !== "${currentFilters.category}"`);
                }
                return matches;
            });
            console.log(`🔍 Filtreleme: ${beforeCount} -> ${filteredApps.length} uygulama`);
        }

        return filteredApps;
    }

    function renderApps() {
        if (!appList) {
            console.error('❌ appList elementi bulunamadı!');
            return;
        }
        
        console.log('🔄 Uygulamalar render ediliyor...');
        appList.innerHTML = "";

        let filteredApps = getFilteredApps();
        console.log(`📋 ${filteredApps.length} uygulama gösterilecek`);

        // Uygulamaları A-Z sıralama
        filteredApps.sort((a, b) => a.name.localeCompare(b.name, 'tr', { sensitivity: 'base' }));

        // Update stats
        updateStats(filteredApps);

        if (filteredApps.length === 0) {
            appList.innerHTML = `
                <div class="no-results">
                    <div class="no-results-icon">🔍</div>
                    <h3>Aradığınız kriterlere uygun uygulama bulunamadı</h3>
                    <p>Farklı filtreler veya arama terimi deneyin</p>
                </div>
            `;
            return;
        }

        filteredApps.forEach((app, index) => {
            const card = document.createElement("div");
            card.className = "card";
            card.style.animationDelay = `${index * 0.1}s`;

            // Icon elementi - SVG ve PNG desteği eklendi
            const iconElement = (app.icon && (app.icon.includes('.png') || app.icon.includes('.svg')))
                ? `<img src="${app.icon}" alt="${app.name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">` 
                : '';
            
            const fallbackIcon = `<div class="card-icon" ${iconElement ? 'style="display:none;"' : ''}>${app.name.charAt(0).toUpperCase()}</div>`;

            // Status rengini ve iconunu belirle
            let statusClass = "green";
            let statusText = "Destekleniyor";
            let statusIcon = "✓";
            
            if (!app.supported) {
                if (app.alternatives && app.alternatives.length > 0) {
                    statusClass = "orange";
                    statusText = "Alternatifler Mevcut";
                    statusIcon = "⚠";
                } else {
                    statusClass = "red";
                    statusText = "Desteklenmiyor";
                    statusIcon = "✗";
                }
            }

            // Category display
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

            // Event listeners
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
    }

    function showInstallPopup(app) {
        if (!popup || !popupTitle || !popupInstructions) return;
        
        // URL hash güncelle - paket yükleme için /p eki
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
                
                // Update content with copy button
                updateTabContentWithCopy(tabContent, app.install[distro]);
            });
            
            tabButtons.appendChild(button);
        });
        
        // Initial content with copy button
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
        
        // Add copy button
        const copyBtn = document.createElement('button');
        copyBtn.className = 'copy-btn';
        copyBtn.innerHTML = '📋';
        copyBtn.title = 'Kopyala';
        copyBtn.addEventListener('click', () => {
            copyToClipboard(command);
        });
        
        tabContent.appendChild(copyBtn);
    }

    function showAboutPopup(app) {
        if (!popup || !popupTitle || !popupInstructions) return;
        
        // URL hash güncelle - hakkında için /h eki
        window.history.pushState({}, '', `#${app.name.toLowerCase().replace(/\s+/g, '-')}/h`);
        
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
                
                // Lazy loading: Sadece tıklandığında görsel yükle
                tabContent.innerHTML = `
                    <div class="loading-message">Yükleniyor...</div>
                `;
                
                const img = new Image();
                img.onload = function() {
                    tabContent.innerHTML = `<img src="${app.about.screenshot}" alt="${app.name} ekran görüntüsü" class="screenshot">`;
                };
                img.onerror = function() {
                    tabContent.innerHTML = `<div class="error-message">Görsel yüklenemedi</div>`;
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
            
            // Varsayılan olarak ekran görüntüsünü yükle
            tabContent.innerHTML = `
                <div class="loading-message">Yükleniyor...</div>
            `;
            
            const img = new Image();
            img.onload = function() {
                tabContent.innerHTML = `<img src="${app.about.screenshot}" alt="${app.name} ekran görüntüsü" class="screenshot">`;
            };
            img.onerror = function() {
                tabContent.innerHTML = `<div class="error-message">Görsel yüklenemedi</div>`;
            };
            img.src = app.about.screenshot;
            
            tabContainer.appendChild(tabButtons);
            tabContainer.appendChild(tabContent);
            popupInstructions.appendChild(tabContainer);
        } else if (app.alternatives && app.alternatives.length > 0) {
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
                
                let imageLoaded = false;
                
                screenshotBtn.addEventListener('click', () => {
                    tabButtons.querySelectorAll('.tab-button').forEach(btn => 
                        btn.classList.remove('active')
                    );
                    screenshotBtn.classList.add('active');
                    
                    if (!imageLoaded) {
                        tabContent.innerHTML = `
                            <div class="loading-message">Yükleniyor...</div>
                        `;
                        
                        const img = new Image();
                        img.onload = function() {
                            tabContent.innerHTML = `<img src="${alt.screenshot}" alt="${alt.name} ekran görüntüsü" class="screenshot">`;
                            imageLoaded = true;
                        };
                        img.onerror = function() {
                            tabContent.innerHTML = `<div class="error-message">Görsel yüklenemedi</div>`;
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
                
                // Varsayılan olarak yükleme mesajı göster
                tabContent.innerHTML = `
                    <div class="loading-message">Yükleniyor...</div>
                `;
                
                const img = new Image();
                img.onload = function() {
                    tabContent.innerHTML = `<img src="${alt.screenshot}" alt="${alt.name} ekran görüntüsü" class="screenshot">`;
                    imageLoaded = true;
                };
                img.onerror = function() {
                    tabContent.innerHTML = `<div class="error-message">Görsel yüklenemedi</div>`;
                };
                img.src = alt.screenshot;
                
                tabContainer.appendChild(tabButtons);
                tabContainer.appendChild(tabContent);
                
                altContainer.appendChild(altHeader);
                altContainer.appendChild(tabContainer);
                popupInstructions.appendChild(altContainer);
            });
        } else {
            // Alternatifi olmayan desteklenmeyen uygulama için sadece desteklenmeme sebebi göster
            popupTitle.textContent = `${app.name} - Desteklenmeme Sebebi`;
            
            popupInstructions.innerHTML = '';
            
            const tabContainer = document.createElement('div');
            const tabButtons = document.createElement('div');
            tabButtons.className = 'tab-buttons';
            
            const tabContent = document.createElement('div');
            tabContent.className = 'tab-content reason-content';
            
            // Desteklenmeme Sebebi tab
            const reasonBtn = document.createElement('button');
            reasonBtn.className = 'tab-button active';
            reasonBtn.textContent = 'Desteklenmeme Sebebi';
            
            reasonBtn.addEventListener('click', () => {
                tabButtons.querySelectorAll('.tab-button').forEach(btn => 
                    btn.classList.remove('active')
                );
                reasonBtn.classList.add('active');
            });
            
            tabButtons.appendChild(reasonBtn);
            
            // Desteklenmeme sebebini göster
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

    // Event Listeners
    
    // Theme toggle
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }

    // Advanced search toggle
    if (advancedToggle && advancedSearch) {
        advancedToggle.addEventListener('click', () => {
            advancedSearch.classList.toggle('active');
        });
    }

    // Search functionality
    if (searchInput) {
        searchInput.addEventListener("input", e => {
            currentFilters.search = e.target.value;
            renderApps();
        });
    }

    // Status filter buttons
    document.querySelectorAll('[data-filter]').forEach(btn => {
        btn.addEventListener('click', () => {
            filterByStatus(btn.dataset.filter);
        });
    });

    // Popup close handlers
    if (popupClose && popup) {
        popupClose.addEventListener("click", () => {
            popup.classList.remove("visible");
            popup.classList.add("hidden");
            currentApp = null;
            // URL hash temizle
            window.history.pushState({}, '', window.location.pathname);
        });

        popup.addEventListener("click", (e) => {
            if (e.target === popup) {
                popup.classList.remove("visible");
                popup.classList.add("hidden");
                currentApp = null;
                // URL hash temizle
                window.history.pushState({}, '', window.location.pathname);
            }
        });
    }

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            if (advancedSearch && advancedSearch.classList.contains('active')) {
                advancedSearch.classList.remove('active');
            } else if (popup && popup.classList.contains("visible")) {
                popup.classList.remove("visible");
                popup.classList.add("hidden");
                currentApp = null;
                // URL hash temizle
                window.history.pushState({}, '', window.location.pathname);
            }
        }
    });

    // URL hash kontrolü - Sayfa yüklendiğinde hash varsa ilgili uygulamayı aç
    function checkHashOnLoad() {
        const hash = window.location.hash.substring(1); // # işaretini kaldır
        if (hash) {
            // Yeni format: app-name/p veya app-name/h
            const parts = hash.split('/');
            const appName = parts[0].replace(/-/g, ' '); // - işaretlerini boşluğa çevir
            const action = parts[1]; // 'p' (package) veya 'h' (hakkında)
            
            const app = apps.find(a => a.name.toLowerCase() === appName.toLowerCase());
            if (app) {
                setTimeout(() => {
                    if (action === 'p' && app.supported) {
                        // Paket yükleme sayfası
                        showInstallPopup(app);
                    } else if (action === 'h' || !app.supported) {
                        // Hakkında/Alternatifler sayfası
                        showAboutPopup(app);
                    } else if (!action) {
                        // Eski format uyumluluğu için
                        if (app.supported) {
                            showInstallPopup(app);
                        } else {
                            showAboutPopup(app);
                        }
                    }
                }, 500); // Biraz bekle ki sayfa tamamen yüklensin
            }
        }
    }

    // Browser back/forward butonları için
    window.addEventListener('popstate', () => {
        if (popup && popup.classList.contains('visible')) {
            popup.classList.remove("visible");
            popup.classList.add("hidden");
            currentApp = null;
        }
        checkHashOnLoad();
    });

    // Initialize everything
    initTheme();
    
    // Kategorileri kontrol et ve uygula
    console.log('🔍 Kategori sistemi kontrolü yapılıyor...');
    
    // Global apps değişkenini kontrol et
    if (typeof window.apps !== 'undefined') {
        console.log('✅ Global apps değişkeni mevcut');
    } else {
        console.log('⚠️ Global apps değişkeni bulunamadı, apps değişkenini global yap');
        window.apps = apps;
    }
    
    // Kategorileri uygula
    if (typeof window.applyCategoriesTo === 'function') {
        console.log('📂 Kategoriler apps verisine uygulanıyor...');
        window.apps = window.applyCategoriesTo(apps);
        console.log('✅ Kategoriler başarıyla uygulandı');
        
        // Kategorizasyon sonuçlarını kontrol et
        const categorizedCount = window.apps.filter(app => app.category && app.category !== 'Diğer').length;
        console.log(`📊 ${categorizedCount}/${window.apps.length} uygulama kategorize edildi`);
        
        // Birkaç örnek logla
        console.log('📝 İlk 5 uygulamanın kategorileri:');
        window.apps.slice(0, 5).forEach(app => {
            console.log(`- ${app.name}: ${app.category || 'Kategori yok'}`);
        });
    } else {
        console.warn('⚠️ applyCategoriesTo fonksiyonu bulunamadı!');
    }
    
    initCategoryFilters();
    renderApps();
    
    // Add subtle animations to stats on load
    setTimeout(() => {
        updateStats();
    }, 300);

    // Sayfa yüklendiğinde hash kontrolü yap
    checkHashOnLoad();

    console.log('✅ Linux App Hub başarıyla başlatıldı!');
    
    // Kategori sistem durumunu logla
    if (typeof window.appCategories === 'object') {
        console.log(`📂 ${Object.keys(window.appCategories).length} uygulama kategorilendirildi`);
        console.log(`📊 ${getAvailableCategories().length} farklı kategori mevcut:`, getAvailableCategories());
    }
};
