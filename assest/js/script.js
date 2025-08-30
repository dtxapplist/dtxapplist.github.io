// assets/js/script.js - Optimize edilmiş versiyon
// Linux App Hub - Analytics entegrasyonlu ve performans optimizasyonlu

window.initLinuxAppHub = function() {
    console.log('🚀 Linux App Hub başlatılıyor - Optimize edilmiş versiyon');
    
    // ============ KONFIGÜRASYON ============
    const CONFIG = {
        APPS_PER_PAGE: 12,
        ANIMATION_DELAY: 0.05, // Daha hızlı animasyon
        LOAD_DELAY: 50, // Daha hızlı yükleme
        SEARCH_DEBOUNCE: 300, // Arama gecikme
        MAX_BUTTON_ATTEMPTS: 5,
        IMAGE_LOAD_TIMEOUT: 5000
    };

    // ============ UTILITY FUNCTIONS ============
    const utils = {
        // Güvenli DOM element getter
        getElement: (id) => {
            const element = document.getElementById(id);
            if (!element) console.warn(`⚠️ Element bulunamadı: #${id}`);
            return element;
        },

        // Debounce function
        debounce: (func, wait) => {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        },

        // Animate number utility
        animateNumber: (element, targetValue, duration = 500) => {
            if (!element) return;
            const startValue = parseInt(element.textContent) || 0;
            const startTime = performance.now();

            const update = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const easeOutQuart = 1 - Math.pow(1 - progress, 4);
                const currentValue = Math.floor(startValue + (targetValue - startValue) * easeOutQuart);
                element.textContent = currentValue;
                if (progress < 1) requestAnimationFrame(update);
            };
            requestAnimationFrame(update);
        },

        // Safe image loader
        loadImage: (src, timeout = CONFIG.IMAGE_LOAD_TIMEOUT) => {
            return new Promise((resolve, reject) => {
                const img = new Image();
                const timer = setTimeout(() => {
                    reject(new Error('Image load timeout'));
                }, timeout);
                
                img.onload = () => {
                    clearTimeout(timer);
                    resolve(img);
                };
                img.onerror = () => {
                    clearTimeout(timer);
                    reject(new Error('Image load failed'));
                };
                img.src = src;
            });
        }
    };

    // ============ DOM ELEMENTS - CACHED ============
    const DOM = {
        appList: utils.getElement("app-list"),
        searchInput: utils.getElement("search"),
        advancedToggle: utils.getElement("advanced-toggle"),
        advancedSearch: utils.getElement("advanced-search"),
        themeToggle: utils.getElement("theme-toggle"),
        toast: utils.getElement("toast"),
        popup: utils.getElement("popup"),
        popupTitle: utils.getElement("popup-title"),
        popupInstructions: utils.getElement("popup-instructions"),
        popupClose: utils.getElement("popup-close"),
        supportedCount: utils.getElement("supported-count"),
        unsupportedCount: utils.getElement("unsupported-count"),
        totalCount: utils.getElement("total-count")
    };

    // ============ STATE MANAGEMENT ============
    const state = {
        currentPage: 1,
        showingAll: false,
        filters: {
            status: 'all',
            category: 'all',
            search: ''
        },
        cache: {
            filteredApps: null,
            categories: null,
            categoryCounts: null
        }
    };

    // ============ DATA VALIDATION ============
    if (typeof apps === 'undefined' || !Array.isArray(apps)) {
        console.error('❌ apps verisi bulunamadı!');
        if (DOM.appList) {
            DOM.appList.innerHTML = '<div class="error-message">❌ Uygulama verileri yüklenemedi. Lütfen sayfayı yenileyin.</div>';
        }
        return;
    }

    console.log(`📊 ${apps.length} uygulama yüklendi`);

    // ============ POPULAR APPS BUTTON ============ 
    const popularButton = {
        create: () => {
            console.log('🔥 Creating popular apps button...');
            
            if (document.getElementById('popular-apps-btn')) {
                console.log('✅ Popular button already exists');
                return;
            }
            
            const statsContainer = document.getElementById('stats');
            if (!statsContainer) {
                console.error('❌ Stats container not found');
                return;
            }
            
            const topBtn = document.createElement('div');
            topBtn.className = 'stat-item popular-btn';
            topBtn.id = 'popular-apps-btn';
            topBtn.title = 'Bu haftanın en popüler uygulamaları';
            
            topBtn.innerHTML = `
                <span class="stat-icon">🔥</span>
                <span class="stat-number">TOP</span>
            `;
            
            topBtn.addEventListener('click', () => {
                console.log('🔥 Popular button clicked!');
                popularButton.handleClick();
            });
            
            topBtn.addEventListener('mouseenter', () => {
                topBtn.style.transform = 'translateY(-4px) scale(1.05)';
            });
            
            topBtn.addEventListener('mouseleave', () => {
                topBtn.style.transform = 'translateY(0) scale(1)';
            });
            
            statsContainer.appendChild(topBtn);
            console.log('✅ Popular button added to stats');
        },
        
        handleClick: async () => {
            console.log('🔥 Popular button handleClick started');
            
            if (window.AnalyticsSystem && typeof window.AnalyticsSystem.calculatePopularApps === 'function') {
                try {
                    console.log('📊 Calling calculatePopularApps...');
                    const result = await window.AnalyticsSystem.calculatePopularApps();
                    console.log('📊 calculatePopularApps result:', result);
                } catch (error) {
                    console.error('❌ calculatePopularApps error:', error);
                    popularButton.showFallbackPopup();
                }
            } else if (window.AnalyticsSystem && typeof window.AnalyticsSystem.getPopularApps === 'function') {
                try {
                    console.log('📊 Calling getPopularApps...');
                    const popularApps = await window.AnalyticsSystem.getPopularApps();
                    console.log('📊 getPopularApps result:', popularApps);
                    
                    if (popularApps && Array.isArray(popularApps) && popularApps.length > 0) {
                        if (typeof window.AnalyticsSystem.showPopularAppsPopup === 'function') {
                            window.AnalyticsSystem.showPopularAppsPopup(popularApps);
                        } else {
                            popularButton.showCustomPopup(popularApps);
                        }
                    } else {
                        console.warn('⚠️ No popular apps data available');
                        popularButton.showFallbackPopup();
                    }
                } catch (error) {
                    console.error('❌ getPopularApps error:', error);
                    popularButton.showFallbackPopup();
                }
            } else {
                console.warn('⚠️ Analytics System not available');
                popularButton.showFallbackPopup();
            }
        },
        
        showFallbackPopup: () => {
            console.log('🎯 Showing fallback popup');
            const fallbackApps = [
                { name: 'Discord', stats: { views: 156 } },
                { name: 'Visual Studio Code', stats: { views: 134 } },
                { name: 'Spotify', stats: { views: 98 } },
                { name: 'Steam', stats: { views: 87 } },
                { name: 'Google Chrome', stats: { views: 76 } }
            ];
            
            if (window.AnalyticsSystem && typeof window.AnalyticsSystem.showPopularAppsPopup === 'function') {
                window.AnalyticsSystem.showPopularAppsPopup(fallbackApps);
            } else {
                popularButton.showCustomPopup(fallbackApps);
            }
        },

        showCustomPopup: (popularApps) => {
            console.log('🎯 Showing custom popup with', popularApps.length, 'apps');
            
            // Create popup
            const popup = document.createElement('div');
            popup.className = 'popular-apps-popup visible';
            popup.innerHTML = `
                <div class="popup-content">
                    <div id="popular-close" style="position: absolute; top: 20px; right: 24px; font-size: 24px; cursor: pointer; color: #ef4444; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; background: rgba(239, 68, 68, 0.1); transition: all 0.3s ease;">×</div>
                    <h2 style="font-size: 1.75rem; font-weight: 700; color: var(--accent-primary); margin-bottom: 24px; padding-right: 50px;">🔥 Bu Haftanın Popüler Uygulamaları</h2>
                    <div class="popular-apps-list">
                        ${popularApps.map((app, index) => `
                            <div style="display: flex; align-items: center; gap: 16px; padding: 12px 0; border-bottom: 1px solid var(--border-muted);">
                                <span style="font-size: 1.5rem; font-weight: bold; color: var(--accent-primary); min-width: 30px;">${index + 1}</span>
                                <div style="flex: 1;">
                                    <div style="font-weight: 600; color: var(--text-primary);">${app.name}</div>
                                    <div style="font-size: 0.875rem; color: var(--text-secondary);">${app.stats?.views || 0} görüntülenme</div>
                                </div>
                                <button onclick="popularButton.openApp('${app.name}')" style="padding: 8px 16px; background: var(--accent-primary); color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 0.875rem; transition: all 0.3s ease;" onmouseover="this.style.background='#7c3aed'" onmouseout="this.style.background='var(--accent-primary)'">Aç</button>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
            
            document.body.appendChild(popup);
            
            // Close functionality
            const closeBtn = popup.querySelector('#popular-close');
            const closePopup = () => {
                popup.classList.remove('visible');
                popup.classList.add('hidden');
                setTimeout(() => document.body.removeChild(popup), 400);
            };
            
            closeBtn.addEventListener('click', closePopup);
            popup.addEventListener('click', (e) => {
                if (e.target === popup) closePopup();
            });
            
            // ESC key
            const escHandler = (e) => {
                if (e.key === 'Escape') {
                    closePopup();
                    document.removeEventListener('keydown', escHandler);
                }
            };
            document.addEventListener('keydown', escHandler);
        },

        openApp: (appName) => {
            console.log('🎯 Opening app:', appName);
            const app = apps.find(a => a.name === appName);
            if (app) {
                // Close popular popup first
                const popup = document.querySelector('.popular-apps-popup');
                if (popup) {
                    popup.classList.remove('visible');
                    popup.classList.add('hidden');
                    setTimeout(() => document.body.removeChild(popup), 200);
                }
                
                // Open app popup
                setTimeout(() => {
                    if (app.supported) {
                        window.showInstallPopup(app);
                    } else {
                        window.showAboutPopup(app);
                    }
                }, 300);
            }
        },
        
        update: (count = 'TOP') => {
            const button = document.getElementById('popular-apps-btn');
            if (button) {
                const numberElement = button.querySelector('.stat-number');
                if (numberElement) {
                    numberElement.textContent = count;
                }
            }
        }
    };

    // ============ ANALYTICS INTEGRATION ============
    const analytics = {
        available: typeof window.AnalyticsSystem !== 'undefined',
        
        track: (appName, action, data = {}) => {
            if (analytics.available && window.AnalyticsSystem?.trackAppView) {
                window.AnalyticsSystem.trackAppView(appName, action);
                console.log(`📊 Analytics: ${appName} - ${action}`);
            }
        },

        init: () => {
            if (analytics.available) {
                console.log('📊 Analytics entegrasyonu aktif');
                analytics.setupEventListeners();
                analytics.setupDevelopmentData();
            } else {
                console.log('⚠️ Analytics sistemi bulunamadı - temel fonksiyonalite devam ediyor');
            }
            
            // Popular button'ı burada oluştur
            setTimeout(() => {
                popularButton.create();
            }, 500);
        },

        setupEventListeners: () => {
            window.addEventListener('popularAppsUpdated', (e) => {
                console.log('📊 Popüler uygulamalar güncellendi:', e.detail.popularApps.length);
                popularButton.update(e.detail.popularApps.length);
            });

            document.addEventListener('visibilitychange', () => {
                if (!document.hidden && window.AnalyticsSystem?.calculatePopularApps) {
                    setTimeout(() => window.AnalyticsSystem.calculatePopularApps(), 1000);
                }
            });
        },

        setupDevelopmentData: () => {
            if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                setTimeout(() => {
                    console.log('🧪 Development mode - Örnek analytics verisi oluşturuluyor...');
                    const sampleApps = ['Discord', 'Visual Studio Code', 'Spotify', 'Steam', 'Google Chrome'];
                    sampleApps.forEach((appName, index) => {
                        setTimeout(() => {
                            analytics.track(appName, 'view');
                            if (index % 2 === 0) analytics.track(appName, 'about');
                            if (index % 3 === 0) analytics.track(appName, 'install');
                        }, index * 100);
                    });
                    
                    setTimeout(() => {
                        if (window.AnalyticsSystem) {
                            window.AnalyticsSystem.getPopularApps().then(apps => {
                                if (apps && apps.length > 0) {
                                    popularButton.update(apps.length);
                                }
                            });
                        }
                    }, 3000);
                }, 2000);
            }
        }
    };

    // ============ CATEGORY MANAGEMENT ============
    const categories = {
        // Optimized category mapping
        APP_CATEGORIES: {
            // İletişim
            "Discord": "İletişim", "Telegram": "İletişim", "WhatsApp": "İletişim", "TeamSpeak": "İletişim",
            "Zoom": "İletişim", "Skype": "İletişim", "Revolt": "İletişim",
            
            // İnternet
            "Google Chrome": "İnternet", "Mozilla Firefox": "İnternet", "Chromium": "İnternet", 
            "Opera": "İnternet", "Brave": "İnternet", "Microsoft Edge": "İnternet",
            "LibreWolf": "İnternet", "Vivaldi": "İnternet", "Zen Browser": "İnternet", "Tor Browser": "İnternet",
            
            // Geliştirme
            "Visual Studio Code": "Geliştirme", "IntelliJ IDEA": "Geliştirme", "PyCharm": "Geliştirme",
            "Atom": "Geliştirme", "Sublime Text": "Geliştirme", "GitHub Desktop": "Geliştirme",
            "CLion": "Geliştirme", "WebStorm": "Geliştirme", "Rider": "Geliştirme", "Unity Hub": "Geliştirme",
            "Electron": "Geliştirme", "Adobe AIR": "Geliştirme",
            
            // Multimedya
            "VLC": "Multimedya", "Spotify": "Multimedya", "OBS Studio": "Multimedya", "Audacity": "Multimedya",
            "GIMP": "Multimedya", "Adobe Photoshop": "Multimedya", "Adobe Premiere Pro": "Multimedya",
            "Adobe Illustrator": "Multimedya", "Adobe Lightroom": "Multimedya", "Blender": "Multimedya",
            "TIDAL Hi-Fi": "Multimedya", "Krita": "Multimedya", "darktable": "Multimedya", "RawTherapee": "Multimedya",
            
            // Oyun
            "Steam": "Oyun", "Epic Games Launcher": "Oyun", "Heroic Games Launcher": "Oyun",
            "Minecraft": "Oyun", "Riot Games": "Oyun",
            
            // Ofis
            "LibreOffice": "Ofis", "Microsoft Office": "Ofis", "OnlyOffice": "Ofis",
            "Adobe Dreamweaver": "Ofis", "Figma Desktop": "Ofis", "Obsidian": "Ofis", "RemNote": "Ofis",
            
            // Sistem
            "VirtualBox": "Sistem", "VMware Workstation": "Sistem", "7-Zip": "Sistem", "WinRAR": "Sistem",
            "PeaZip": "Sistem", "AutoCAD": "Sistem", "FreeCAD": "Sistem", "LibreCAD": "Sistem",
            "Syncthing": "Sistem", "UBinary": "Sistem", "Scratch": "Sistem",
            
            // Güvenlik
            "1Password": "Güvenlik", "KeePass": "Güvenlik", "Bitwarden": "Güvenlik", "Proton VPN": "Güvenlik",
            
            // Uzaktan Erişim
            "TeamViewer": "Uzaktan Erişim", "AnyDesk": "Uzaktan Erişim", "RustDesk": "Uzaktan Erişim",
            
            // E-posta
            "Thunderbird": "E-posta"
        },

        assign: () => {
            console.log('📂 Kategoriler atanıyor...');
            
            // External categories.js varsa kullan
            if (typeof window.applyCategoriesTo === 'function') {
                return;
            }
            
            apps.forEach(app => {
                // Direkt eşleşme
                let category = categories.APP_CATEGORIES[app.name];
                
                // Kısmi eşleşme
                if (!category) {
                    for (const [appName, cat] of Object.entries(categories.APP_CATEGORIES)) {
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
        },

        get: () => {
            if (!state.cache.categories) {
                state.cache.categories = [...new Set(apps.map(app => app.category).filter(Boolean))].sort();
            }
            return state.cache.categories;
        },

        getCounts: () => {
            if (!state.cache.categoryCounts) {
                state.cache.categoryCounts = apps.reduce((counts, app) => {
                    const category = app.category || 'Diğer';
                    counts[category] = (counts[category] || 0) + 1;
                    return counts;
                }, {});
            }
            return state.cache.categoryCounts;
        }
    };

    // ============ THEME MANAGEMENT ============
    const theme = {
        init: () => {
            const savedTheme = localStorage.getItem('theme') || 'dark';
            document.documentElement.setAttribute('data-theme', savedTheme);
            theme.updateIcon(savedTheme);
        },

        toggle: () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            theme.updateIcon(newTheme);
        },

        updateIcon: (themeName) => {
            if (!DOM.themeToggle) return;
            const themeIcon = DOM.themeToggle.querySelector('.theme-icon');
            if (themeIcon) {
                themeIcon.textContent = themeName === 'dark' ? '☀️' : '🌙';
                DOM.themeToggle.title = themeName === 'dark' ? 'Açık Tema' : 'Koyu Tema';
            }
        }
    };

    // ============ TOAST SYSTEM ============
    const toast = {
        show: (message, icon = '✅') => {
            if (!DOM.toast) return;
            
            const toastIcon = DOM.toast.querySelector('.toast-icon');
            const toastMessage = DOM.toast.querySelector('.toast-message');
            
            if (toastIcon) toastIcon.textContent = icon;
            if (toastMessage) toastMessage.textContent = message;
            
            DOM.toast.classList.add('show');
            setTimeout(() => DOM.toast.classList.remove('show'), 3000);
        }
    };

    // ============ CLIPBOARD UTILITY ============
    const clipboard = {
        copy: async (text) => {
            try {
                await navigator.clipboard.writeText(text);
                toast.show('Komut kopyalandı!', '📋');
                analytics.track('copy_command', 'action');
            } catch (err) {
                // Fallback for older browsers
                const textArea = document.createElement('textarea');
                textArea.value = text;
                textArea.style.cssText = 'position:fixed;opacity:0;';
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                toast.show('Komut kopyalandı!', '📋');
                analytics.track('copy_command', 'action');
            }
        }
    };

    // ============ FILTERING SYSTEM ============
    const filters = {
        reset: () => {
            state.currentPage = 1;
            state.showingAll = false;
            state.cache.filteredApps = null;
        },

        byStatus: (status) => {
            console.log('🔍 Durum filtresi:', status);
            state.filters.status = status;
            document.querySelectorAll('[data-filter]').forEach(btn => {
                btn.classList.toggle('active', btn.dataset.filter === status);
            });
            filters.reset();
            render.apps();
        },

        byCategory: (category) => {
            console.log('🔍 Kategori filtresi:', category);
            state.filters.category = category;
            
            document.querySelectorAll('#category-filter-buttons [data-category]').forEach(btn => {
                btn.classList.toggle('active', btn.dataset.category === category);
            });
            
            filters.reset();
            render.apps();
        },

        getFiltered: () => {
            if (state.cache.filteredApps) return state.cache.filteredApps;
            
            console.log('🔍 Filtreleme yapılıyor:', state.filters);
            
            let filtered = apps.slice();
            
            // Arama filtresi
            if (state.filters.search) {
                const searchTerm = state.filters.search.toLowerCase();
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
            if (state.filters.status !== 'all') {
                switch (state.filters.status) {
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
            if (state.filters.category !== 'all') {
                filtered = filtered.filter(app => app.category === state.filters.category);
            }
            
            // Alfabetik sıralama
            filtered.sort((a, b) => a.name.localeCompare(b.name, 'tr'));
            
            state.cache.filteredApps = filtered;
            console.log(`📋 Filtreleme sonucu: ${filtered.length} uygulama`);
            return filtered;
        }
    };

    // ============ STATISTICS ============
    const stats = {
        update: (filteredApps = apps) => {
            const supported = filteredApps.filter(app => app.supported).length;
            const unsupported = filteredApps.filter(app => !app.supported).length;
            const total = filteredApps.length;

            if (DOM.supportedCount) utils.animateNumber(DOM.supportedCount, supported);
            if (DOM.unsupportedCount) utils.animateNumber(DOM.unsupportedCount, unsupported);
            if (DOM.totalCount) utils.animateNumber(DOM.totalCount, total);
        }
    };

    // ============ POPUP SYSTEM ============
    const popup = {
        show: (app, type = 'auto') => {
            if (!DOM.popup || !DOM.popupTitle || !DOM.popupInstructions) return;
            
            // Auto-determine popup type
            if (type === 'auto') {
                type = (app.supported) ? 'install' : 'about';
            }
            
            // Analytics tracking
            analytics.track(app.name, `${type}_popup_opened`);
            
            // URL hash update
            const hashType = type === 'install' ? 'p' : 'h';
            window.history.pushState({}, '', `#${app.name.toLowerCase().replace(/\s+/g, '-')}/${hashType}`);
            
            if (type === 'install' && app.supported) {
                popup.showInstall(app);
            } else {
                popup.showAbout(app);
            }
            
            DOM.popup.classList.remove("hidden");
            DOM.popup.classList.add("visible");
        },

        showInstall: (app) => {
            DOM.popupTitle.textContent = `${app.name} - Kurulum`;
            DOM.popupInstructions.innerHTML = '';
            
            const tabContainer = document.createElement('div');
            const tabButtons = document.createElement('div');
            tabButtons.className = 'tab-buttons';
            
            const tabContent = document.createElement('div');
            tabContent.className = 'tab-content';
            
            const distros = Object.keys(app.install);
            let activeDistro = distros[0];
            
            // Tab buttons
            distros.forEach((distro, index) => {
                const button = document.createElement('button');
                button.className = `tab-button ${index === 0 ? 'active' : ''}`;
                button.textContent = distro;
                
                button.addEventListener('click', () => {
                    tabButtons.querySelectorAll('.tab-button').forEach(btn => 
                        btn.classList.remove('active')
                    );
                    button.classList.add('active');
                    popup.updateTabContent(tabContent, app.install[distro]);
                    activeDistro = distro;
                });
                
                tabButtons.appendChild(button);
            });
            
            popup.updateTabContent(tabContent, app.install[activeDistro]);
            
            tabContainer.appendChild(tabButtons);
            tabContainer.appendChild(tabContent);
            DOM.popupInstructions.appendChild(tabContainer);
        },

        showAbout: (app) => {
            if (app.supported) {
                popup.showSupportedAbout(app);
            } else if (app.alternatives?.length > 0) {
                popup.showAlternatives(app);
            } else {
                popup.showUnsupportedReason(app);
            }
        },

        showSupportedAbout: (app) => {
            DOM.popupTitle.textContent = `${app.name} - Hakkında`;
            DOM.popupInstructions.innerHTML = '';
            
            const tabContainer = document.createElement('div');
            const tabButtons = document.createElement('div');
            tabButtons.className = 'tab-buttons';
            
            const tabContent = document.createElement('div');
            tabContent.className = 'tab-content about-content';
            
            const screenshotBtn = popup.createTabButton('Ekran Görüntüsü', true);
            const websiteBtn = popup.createTabButton('Web Sitesi', false);
            
            // Screenshot tab
            screenshotBtn.addEventListener('click', () => {
                popup.activateTab(tabButtons, screenshotBtn);
                popup.loadScreenshot(tabContent, app.about.screenshot, app.name);
            });
            
            // Website tab
            websiteBtn.addEventListener('click', () => {
                popup.activateTab(tabButtons, websiteBtn);
                tabContent.innerHTML = `<a href="${app.about.website}" target="_blank" class="website-link">🌐 ${app.about.website}</a>`;
            });
            
            tabButtons.appendChild(screenshotBtn);
            tabButtons.appendChild(websiteBtn);
            
            // Load initial screenshot
            popup.loadScreenshot(tabContent, app.about.screenshot, app.name);
            
            tabContainer.appendChild(tabButtons);
            tabContainer.appendChild(tabContent);
            DOM.popupInstructions.appendChild(tabContainer);
        },

        showAlternatives: (app) => {
            DOM.popupTitle.textContent = `${app.name} - Alternatifler`;
            DOM.popupInstructions.innerHTML = '';
            
            app.alternatives.forEach((alt, index) => {
                const altContainer = document.createElement('div');
                altContainer.className = 'alternative-container';
                
                const altHeader = document.createElement('div');
                altHeader.className = 'alternative-header';
                altHeader.innerHTML = `<h3>${alt.name}</h3><p>${alt.description}</p>`;
                
                const tabContainer = document.createElement('div');
                const tabButtons = document.createElement('div');
                tabButtons.className = 'tab-buttons';
                
                const tabContent = document.createElement('div');
                tabContent.className = 'tab-content about-content';
                
                const screenshotBtn = popup.createTabButton('Ekran Görüntüsü', true);
                const websiteBtn = popup.createTabButton('Web Sitesi', false);
                
                screenshotBtn.addEventListener('click', () => {
                    popup.activateTab(tabButtons, screenshotBtn);
                    popup.loadScreenshot(tabContent, alt.screenshot, alt.name);
                });
                
                websiteBtn.addEventListener('click', () => {
                    popup.activateTab(tabButtons, websiteBtn);
                    tabContent.innerHTML = `<a href="${alt.website}" target="_blank" class="website-link">🌐 ${alt.website}</a>`;
                });
                
                tabButtons.appendChild(screenshotBtn);
                tabButtons.appendChild(websiteBtn);
                
                popup.loadScreenshot(tabContent, alt.screenshot, alt.name);
                
                tabContainer.appendChild(tabButtons);
                tabContainer.appendChild(tabContent);
                altContainer.appendChild(altHeader);
                altContainer.appendChild(tabContainer);
                DOM.popupInstructions.appendChild(altContainer);
            });
        },

        showUnsupportedReason: (app) => {
            DOM.popupTitle.textContent = `${app.name} - Desteklenmeme Sebebi`;
            DOM.popupInstructions.innerHTML = '';
            
            const tabContainer = document.createElement('div');
            const tabButtons = document.createElement('div');
            tabButtons.className = 'tab-buttons';
            
            const tabContent = document.createElement('div');
            tabContent.className = 'tab-content reason-content';
            
            const reasonBtn = popup.createTabButton('Desteklenmeme Sebebi', true);
            tabButtons.appendChild(reasonBtn);
            
            tabContent.innerHTML = `<p>${app.unsupportedReason}</p>`;
            if (app.about?.website) {
                tabContent.innerHTML += `<br><a href="${app.about.website}" target="_blank" class="website-link">🌐 Resmi Web Sitesi</a>`;
            }
            
            tabContainer.appendChild(tabButtons);
            tabContainer.appendChild(tabContent);
            DOM.popupInstructions.appendChild(tabContainer);
        },

        createTabButton: (text, active = false) => {
            const button = document.createElement('button');
            button.className = `tab-button ${active ? 'active' : ''}`;
            button.textContent = text;
            return button;
        },

        activateTab: (tabButtons, activeButton) => {
            tabButtons.querySelectorAll('.tab-button').forEach(btn => 
                btn.classList.remove('active')
            );
            activeButton.classList.add('active');
        },

        loadScreenshot: async (container, src, altText) => {
            container.innerHTML = '<div class="loading-message">Yükleniyor...</div>';
            
            try {
                await utils.loadImage(src);
                container.innerHTML = `<img src="${src}" alt="${altText} ekran görüntüsü" class="screenshot">`;
            } catch (error) {
                container.innerHTML = '<div class="error-message">Görsel yüklenemedi</div>';
                console.warn('Screenshot yüklenemedi:', src, error);
            }
        },

        updateTabContent: (container, command) => {
            if (!container) return;
            
            container.innerHTML = '';
            container.textContent = command;
            
            const copyBtn = document.createElement('button');
            copyBtn.className = 'copy-btn';
            copyBtn.innerHTML = '📋';
            copyBtn.title = 'Kopyala';
            copyBtn.addEventListener('click', () => clipboard.copy(command));
            
            container.appendChild(copyBtn);
        },

        hide: () => {
            if (DOM.popup) {
                DOM.popup.classList.remove("visible");
                DOM.popup.classList.add("hidden");
                window.history.pushState({}, '', window.location.pathname);
            }
        }
    };

    // ============ RENDERING SYSTEM ============
    const render = {
        apps: () => {
            console.log('🎨 Apps render ediliyor...');
            
            if (!DOM.appList) return;
            
            DOM.appList.innerHTML = "";
            const filteredApps = filters.getFiltered();
            
            stats.update(filteredApps);

            if (filteredApps.length === 0) {
                DOM.appList.innerHTML = `
                    <div class="no-results">
                        <div class="no-results-icon">🔍</div>
                        <h3>Sonuç bulunamadı</h3>
                        <p>Filtreler: Kategori="${state.filters.category}", Durum="${state.filters.status}", Arama="${state.filters.search}"</p>
                    </div>
                `;
                return;
            }

            // Pagination logic
            let appsToShow = filteredApps;
            let shouldShowMoreButton = false;

            if (!state.showingAll && filteredApps.length > CONFIG.APPS_PER_PAGE) {
                appsToShow = filteredApps.slice(0, CONFIG.APPS_PER_PAGE);
                shouldShowMoreButton = true;
            }

            // Render app cards
            const fragment = document.createDocumentFragment();
            
            appsToShow.forEach((app, index) => {
                const card = render.createAppCard(app, index);
                fragment.appendChild(card);
            });

            DOM.appList.appendChild(fragment);

            // Show more button
            if (shouldShowMoreButton) {
                const showMoreButton = render.createShowMoreButton(filteredApps);
                DOM.appList.appendChild(showMoreButton);
            }
            
            console.log(`✅ ${appsToShow.length}/${filteredApps.length} kart render edildi`);
        },

        createAppCard: (app, index) => {
            const card = document.createElement("div");
            card.className = "card";
            card.style.animationDelay = `${index * CONFIG.ANIMATION_DELAY}s`;

            // Icon
            const iconElement = app.icon ? 
                `<img src="${app.icon}" alt="${app.name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">` 
                : '';
            const fallbackIcon = `<div class="card-icon" ${iconElement ? 'style="display:none;"' : ''}>${app.name.charAt(0).toUpperCase()}</div>`;

            // Status
            const status = render.getAppStatus(app);
            const categoryDisplay = app.category ? `<div class="app-category">${app.category}</div>` : '';

            card.innerHTML = `
                <div class="card-header">
                    ${iconElement}
                    ${fallbackIcon}
                    <div class="card-info">
                        <div class="app-name">${app.name}</div>
                        ${categoryDisplay}
                        <div class="status ${status.class}">
                            <span class="status-icon">${status.icon}</span>
                            ${status.text}
                        </div>
                    </div>
                </div>
                <div class="card-actions">
                    ${app.supported ? `<button class="action-btn install-btn" data-action="install" title="Kurulum Talimatları">📦</button>` : ''}
                    <button class="action-btn about-btn" data-action="about" title="${status.aboutTitle}">ℹ️</button>
                </div>
            `;

            // Event listeners with analytics
            if (app.supported) {
                const installBtn = card.querySelector('.install-btn');
                if (installBtn) {
                    installBtn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        analytics.track(app.name, 'install');
                        popup.show(app, 'install');
                    });
                }
            }

            const aboutBtn = card.querySelector('.about-btn');
            if (aboutBtn) {
                aboutBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    analytics.track(app.name, 'about');
                    popup.show(app, 'about');
                });
            }

            // Card click analytics
            card.addEventListener('click', () => {
                analytics.track(app.name, 'view');
            });

            return card;
        },

        getAppStatus: (app) => {
            if (app.supported) {
                return {
                    class: "green",
                    text: "Destekleniyor",
                    icon: "✓",
                    aboutTitle: "Hakkında"
                };
            } else if (app.alternatives?.length > 0) {
                return {
                    class: "orange",
                    text: "Alternatifler Mevcut",
                    icon: "⚠",
                    aboutTitle: "Alternatifler"
                };
            } else {
                return {
                    class: "red",
                    text: "Desteklenmiyor",
                    icon: "✗",
                    aboutTitle: "Neden Desteklenmiyor?"
                };
            }
        },

        createShowMoreButton: (filteredApps) => {
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
            button.textContent = `Daha Fazla Göster (${filteredApps.length - CONFIG.APPS_PER_PAGE} kaldı)`;
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
            
            const hoverStyle = {
                enter: () => {
                    button.style.background = 'var(--accent-primary)';
                    button.style.color = 'white';
                    button.style.transform = 'translateY(-2px) scale(1.05)';
                    button.style.boxShadow = '0 12px 32px rgba(139, 92, 246, 0.4)';
                },
                leave: () => {
                    button.style.background = 'var(--bg-secondary)';
                    button.style.color = 'var(--accent-primary)';
                    button.style.transform = 'translateY(0) scale(1)';
                    button.style.boxShadow = '0 8px 24px var(--shadow-color)';
                }
            };
            
            button.addEventListener('mouseenter', hoverStyle.enter);
            button.addEventListener('mouseleave', hoverStyle.leave);
            button.addEventListener('click', () => {
                state.showingAll = true;
                render.apps();
                analytics.track('show_more_apps', 'action');
            });
            
            showMoreBtn.appendChild(button);
            return showMoreBtn;
        }
    };

    // ============ CATEGORY FILTERS UI ============
    const categoryFilters = {
        init: () => {
            console.log('🏷️ Kategori filtreleri oluşturuluyor...');
            
            if (!DOM.advancedSearch) return;
            
            let categoryFilterGroup = DOM.advancedSearch.querySelector('.category-filter-group');
            if (!categoryFilterGroup) {
                const searchFilters = DOM.advancedSearch.querySelector('.search-filters');
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
            
            const categoryList = categories.get();
            const counts = categories.getCounts();
            
            // "Tümü" butonu
            const allButton = document.createElement('button');
            allButton.className = 'filter-btn active';
            allButton.setAttribute('data-category', 'all');
            allButton.innerHTML = `Tümü <span class="count">(${apps.length})</span>`;
            allButton.addEventListener('click', () => filters.byCategory('all'));
            categoryButtons.appendChild(allButton);
            
            // Kategori butonları
            categoryList.forEach(category => {
                const count = counts[category] || 0;
                if (count > 0) {
                    const button = document.createElement('button');
                    button.className = 'filter-btn';
                    button.setAttribute('data-category', category);
                    button.innerHTML = `${category} <span class="count">(${count})</span>`;
                    button.addEventListener('click', () => filters.byCategory(category));
                    categoryButtons.appendChild(button);
                }
            });
            
            console.log(`✅ ${categoryList.length + 1} kategori butonu oluşturuldu`);
        },

        hideMainFilters: () => {
            const categoryFilters = document.getElementById('category-filters');
            if (categoryFilters) {
                categoryFilters.style.display = 'none';
                console.log('📋 Ana sayfadaki kategori filtreleri gizlendi');
            }
        }
    };

    // ============ URL HASH MANAGEMENT ============
    const urlHash = {
        check: () => {
            const hash = window.location.hash.substring(1);
            if (!hash) return;
            
            const parts = hash.split('/');
            const appName = parts[0].replace(/-/g, ' ');
            const action = parts[1];
            
            const app = apps.find(a => a.name.toLowerCase() === appName.toLowerCase());
            if (app) {
                setTimeout(() => {
                    if (action === 'p' && app.supported) {
                        popup.show(app, 'install');
                    } else if (action === 'h' || !app.supported) {
                        popup.show(app, 'about');
                    } else if (!action) {
                        popup.show(app, 'auto');
                    }
                }, CONFIG.LOAD_DELAY * 10);
            }
        }
    };

    // ============ EVENT LISTENERS ============
    const events = {
        init: () => {
            // Theme toggle
            if (DOM.themeToggle) {
                DOM.themeToggle.addEventListener('click', theme.toggle);
            }

            // Advanced search toggle
            if (DOM.advancedToggle && DOM.advancedSearch) {
                DOM.advancedToggle.addEventListener('click', () => {
                    DOM.advancedSearch.classList.toggle('active');
                });
            }

            // Search input with debounce
            if (DOM.searchInput) {
                const debouncedSearch = utils.debounce((value) => {
                    state.filters.search = value;
                    state.cache.filteredApps = null; // Invalidate cache
                    filters.reset();
                    render.apps();
                }, CONFIG.SEARCH_DEBOUNCE);

                DOM.searchInput.addEventListener('input', (e) => {
                    debouncedSearch(e.target.value);
                });
            }

            // Status filter buttons
            document.querySelectorAll('[data-filter]').forEach(btn => {
                btn.addEventListener('click', () => {
                    filters.byStatus(btn.dataset.filter);
                });
            });

            // Popup events
            if (DOM.popupClose && DOM.popup) {
                DOM.popupClose.addEventListener('click', popup.hide);
                DOM.popup.addEventListener('click', (e) => {
                    if (e.target === DOM.popup) {
                        popup.hide();
                    }
                });
            }

            // Keyboard events
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    if (DOM.advancedSearch?.classList.contains('active')) {
                        DOM.advancedSearch.classList.remove('active');
                    } else if (DOM.popup?.classList.contains('visible')) {
                        popup.hide();
                    } else if (analytics.available && window.AnalyticsSystem?.closePopularAppsPopup) {
                        window.AnalyticsSystem.closePopularAppsPopup();
                    }
                }
            });

            // Browser navigation
            window.addEventListener('popstate', () => {
                if (DOM.popup?.classList.contains('visible')) {
                    popup.hide();
                }
                urlHash.check();
            });

            console.log('✅ Event listeners başarıyla eklendi');
        }
    };

    // ============ GLOBAL FUNCTIONS ============
    // Analytics System için global fonksiyonlar
    window.showAppPopup = (app, type) => {
        popup.show(app, type === 'install' && app.supported ? 'install' : 'about');
    };

    window.showInstallPopup = (app) => {
        popup.show(app, 'install');
    };

    window.showAboutPopup = (app) => {
        popup.show(app, 'about');
    };

    // Popular button global access
    window.popularButton = popularButton;

    // ============ INIT SYSTEM ============ 
    const init = {
        start: () => {
            console.log('🚀 Sistem başlatılıyor...');
            
            const startTime = performance.now();
            
            theme.init();
            categories.assign();
            categoryFilters.hideMainFilters();
            categoryFilters.init();
            events.init();
            analytics.init();  // Analytics initialization with popular button
            
            render.apps();
            
            setTimeout(() => {
                stats.update();
            }, CONFIG.LOAD_DELAY * 6);

            urlHash.check();
            
            const endTime = performance.now();
            console.log(`✅ Linux App Hub hazır! (${Math.round(endTime - startTime)}ms)`);
        }
    };

    // Start the application
    init.start();
};
