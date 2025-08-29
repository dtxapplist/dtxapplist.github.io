// assest/data/categories.js - Kategori sistemi
// Linux App Hub kategori yönetimi

(function() {
    'use strict';

    console.log('🗂️ Categories.js yükleniyor...');

    // ============ KATEGORI TANIMLAMALARI ============
    const CATEGORY_DEFINITIONS = {
        // İletişim ve Sosyal
        "İletişim": {
            description: "Anlık mesajlaşma, video konferans ve sosyal medya uygulamaları",
            icon: "💬",
            color: "#10B981",
            keywords: ["chat", "message", "communication", "social", "video", "call", "konferans", "mesaj"]
        },

        // İnternet ve Tarayıcılar
        "İnternet": {
            description: "Web tarayıcıları ve internet araçları",
            icon: "🌐",
            color: "#3B82F6", 
            keywords: ["browser", "web", "internet", "surf", "tarayıcı", "online"]
        },

        // Geliştirme Araçları
        "Geliştirme": {
            description: "Kod editörleri, IDE'ler ve geliştirme araçları",
            icon: "⚡",
            color: "#8B5CF6",
            keywords: ["code", "development", "programming", "ide", "editor", "geliştirme", "kod", "program"]
        },

        // Multimedya
        "Multimedya": {
            description: "Ses, video, görsel düzenleme ve multimedya oynatıcıları",
            icon: "🎨",
            color: "#F59E0B",
            keywords: ["audio", "video", "image", "media", "player", "edit", "design", "müzik", "video", "görsel"]
        },

        // Oyunlar
        "Oyun": {
            description: "Oyun platformları ve oyunlar",
            icon: "🎮",
            color: "#EF4444",
            keywords: ["game", "gaming", "play", "oyun", "eğlence", "platform"]
        },

        // Ofis ve Verimlilik
        "Ofis": {
            description: "Ofis uygulamaları, not alma ve verimlilik araçları",
            icon: "📝",
            color: "#06B6D4",
            keywords: ["office", "productivity", "document", "note", "write", "ofis", "döküman", "verimlilik"]
        },

        // Sistem Araçları
        "Sistem": {
            description: "Sistem yönetimi, arşivleme ve sistem araçları",
            icon: "⚙️",
            color: "#6B7280",
            keywords: ["system", "utility", "tool", "archive", "compress", "sistem", "araç", "yönetim"]
        },

        // Güvenlik
        "Güvenlik": {
            description: "Şifre yöneticileri, VPN ve güvenlik araçları",
            icon: "🔒",
            color: "#DC2626",
            keywords: ["security", "password", "vpn", "encryption", "güvenlik", "şifre", "koruma"]
        },

        // Uzaktan Erişim
        "Uzaktan Erişim": {
            description: "Uzaktan masaüstü ve erişim araçları",
            icon: "🖥️",
            color: "#7C3AED",
            keywords: ["remote", "desktop", "access", "control", "uzak", "erişim", "kontrol"]
        },

        // E-posta
        "E-posta": {
            description: "E-posta istemcileri ve yönetim araçları",
            icon: "📧",
            color: "#059669",
            keywords: ["email", "mail", "client", "message", "e-posta", "elektronik", "posta"]
        },

        // Diğer (fallback)
        "Diğer": {
            description: "Diğer kategorilere girmeyen uygulamalar",
            icon: "📦",
            color: "#9CA3AF",
            keywords: []
        }
    };

    // ============ UYGULAMA KATEGORI EŞLEMELERI ============
    const APP_CATEGORY_MAPPINGS = {
        // İletişim
        "Discord": "İletişim",
        "Telegram": "İletişim", 
        "WhatsApp": "İletişim",
        "TeamSpeak": "İletişim",
        "Zoom": "İletişim",
        "Skype": "İletişim",
        "Revolt": "İletişim",
        "Signal": "İletişim",
        "Slack": "İletişim",
        "Microsoft Teams": "İletişim",

        // İnternet
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
        "Safari": "İnternet",

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
        "Electron": "Geliştirme",
        "Adobe AIR": "Geliştirme",
        "Android Studio": "Geliştirme",
        "Xcode": "Geliştirme",
        "Eclipse": "Geliştirme",
        "NetBeans": "Geliştirme",

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
        "Inkscape": "Multimedya",
        "DaVinci Resolve": "Multimedya",
        "Kdenlive": "Multimedya",
        "Canva": "Multimedya",

        // Oyun  
        "Steam": "Oyun",
        "Epic Games Launcher": "Oyun",
        "Heroic Games Launcher": "Oyun",
        "Minecraft": "Oyun",
        "Riot Games": "Oyun",
        "Origin": "Oyun",
        "Uplay": "Oyun",
        "GOG Galaxy": "Oyun",
        "Lutris": "Oyun",

        // Ofis
        "LibreOffice": "Ofis",
        "Microsoft Office": "Ofis", 
        "OnlyOffice": "Ofis",
        "Adobe Dreamweaver": "Ofis",
        "Figma Desktop": "Ofis",
        "Obsidian": "Ofis",
        "RemNote": "Ofis",
        "Notion": "Ofis",
        "Trello": "Ofis",
        "Evernote": "Ofis",
        "OneNote": "Ofis",
        "Google Docs": "Ofis",

        // Sistem
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
        "Docker": "Sistem",
        "Parallels Desktop": "Sistem",

        // Güvenlik
        "1Password": "Güvenlik",
        "KeePass": "Güvenlik",
        "Bitwarden": "Güvenlik", 
        "Proton VPN": "Güvenlik",
        "NordVPN": "Güvenlik",
        "ExpressVPN": "Güvenlik",
        "Malwarebytes": "Güvenlik",

        // Uzaktan Erişim
        "TeamViewer": "Uzaktan Erişim",
        "AnyDesk": "Uzaktan Erişim",
        "RustDesk": "Uzaktan Erişim",
        "Chrome Remote Desktop": "Uzaktan Erişim",
        "Parsec": "Uzaktan Erişim",

        // E-posta
        "Thunderbird": "E-posta",
        "Outlook": "E-posta",
        "Apple Mail": "E-posta",
        "Evolution": "E-posta"
    };

    // ============ KATEGORI SISTEMI SINIFI ============
    class CategorySystem {
        constructor() {
            this.categories = CATEGORY_DEFINITIONS;
            this.mappings = APP_CATEGORY_MAPPINGS;
            this.isInitialized = false;
        }

        // Ana kategori uygulama fonksiyonu
        applyCategoriesToApps(apps) {
            if (!Array.isArray(apps)) {
                console.error('❌ Categories: apps parametresi array değil');
                return;
            }

            console.log(`🗂️ ${apps.length} uygulama kategorize ediliyor...`);

            let categorizedCount = 0;
            let unCategorizedApps = [];

            apps.forEach(app => {
                if (!app.name) return;

                let category = this.getAppCategory(app.name);
                
                if (category && category !== 'Diğer') {
                    app.category = category;
                    categorizedCount++;
                } else {
                    // Otomatik kategori tespiti dene
                    category = this.detectCategoryFromName(app.name);
                    if (category && category !== 'Diğer') {
                        app.category = category;
                        categorizedCount++;
                    } else {
                        app.category = 'Diğer';
                        unCategorizedApps.push(app.name);
                    }
                }
            });

            console.log(`✅ ${categorizedCount}/${apps.length} uygulama kategorize edildi`);
            
            if (unCategorizedApps.length > 0) {
                console.log(`⚠️ Kategorize edilemeyen uygulamalar (${unCategorizedApps.length}):`, unCategorizedApps);
            }

            this.isInitialized = true;
            return {
                total: apps.length,
                categorized: categorizedCount,
                uncategorized: unCategorizedApps.length,
                uncategorizedApps: unCategorizedApps
            };
        }

        // Uygulama adına göre kategori bul
        getAppCategory(appName) {
            if (!appName) return 'Diğer';

            // Direkt eşleşme kontrol et
            if (this.mappings[appName]) {
                return this.mappings[appName];
            }

            // Kısmi eşleşme kontrol et
            const lowerAppName = appName.toLowerCase();
            
            for (const [mappedApp, category] of Object.entries(this.mappings)) {
                const lowerMappedApp = mappedApp.toLowerCase();
                
                // İki yönlü kısmi eşleşme
                if (lowerAppName.includes(lowerMappedApp) || lowerMappedApp.includes(lowerAppName)) {
                    console.log(`🔍 Kısmi eşleşme bulundu: "${appName}" -> "${mappedApp}" (${category})`);
                    return category;
                }
            }

            return null;
        }

        // İsim bazlı otomatik kategori tespiti
        detectCategoryFromName(appName) {
            if (!appName) return 'Diğer';

            const lowerAppName = appName.toLowerCase();

            // Kategori tanımlarındaki anahtar kelimelere bak
            for (const [categoryName, categoryInfo] of Object.entries(this.categories)) {
                if (categoryName === 'Diğer') continue;

                const keywords = categoryInfo.keywords || [];
                
                for (const keyword of keywords) {
                    if (lowerAppName.includes(keyword.toLowerCase())) {
                        console.log(`🤖 Otomatik tespit: "${appName}" -> ${categoryName} (anahtar: "${keyword}")`);
                        return categoryName;
                    }
                }
            }

            // Dosya uzantısı veya özel desenler
            if (lowerAppName.includes('browser') || lowerAppName.includes('tarayıcı')) {
                return 'İnternet';
            }
            
            if (lowerAppName.includes('editor') || lowerAppName.includes('ide')) {
                return 'Geliştirme';
            }

            if (lowerAppName.includes('player') || lowerAppName.includes('media')) {
                return 'Multimedya';
            }

            if (lowerAppName.includes('office') || lowerAppName.includes('word') || lowerAppName.includes('excel')) {
                return 'Ofis';
            }

            return 'Diğer';
        }

        // Kategori bilgilerini getir
        getCategoryInfo(categoryName) {
            return this.categories[categoryName] || this.categories['Diğer'];
        }

        // Tüm kategorileri listele
        getAllCategories() {
            return Object.keys(this.categories);
        }

        // Kategori istatistikleri
        getCategoryStats(apps) {
            const stats = {};
            
            Object.keys(this.categories).forEach(category => {
                stats[category] = {
                    count: 0,
                    apps: [],
                    ...this.categories[category]
                };
            });

            if (Array.isArray(apps)) {
                apps.forEach(app => {
                    const category = app.category || 'Diğer';
                    if (stats[category]) {
                        stats[category].count++;
                        stats[category].apps.push(app.name);
                    }
                });
            }

            return stats;
        }

        // Yeni kategori mapping ekle
        addMapping(appName, categoryName) {
            if (!appName || !categoryName) return false;
            
            if (!this.categories[categoryName]) {
                console.warn(`⚠️ Kategori mevcut değil: ${categoryName}`);
                return false;
            }

            this.mappings[appName] = categoryName;
            console.log(`➕ Yeni mapping eklendi: "${appName}" -> ${categoryName}`);
            return true;
        }

        // Debug bilgileri
        getDebugInfo() {
            return {
                totalCategories: Object.keys(this.categories).length,
                totalMappings: Object.keys(this.mappings).length,
                isInitialized: this.isInitialized,
                categories: Object.keys(this.categories),
                recentMappings: Object.entries(this.mappings).slice(-5)
            };
        }
    }

    // ============ GLOBAL SETUP ============
    
    // Kategori sistemini oluştur
    const categorySystem = new CategorySystem();

    // Global fonksiyonlar
    window.applyCategoriesTo = function(apps) {
        return categorySystem.applyCategoriesToApps(apps);
    };

    window.appCategories = {
        apply: (apps) => categorySystem.applyCategoriesToApps(apps),
        get: (appName) => categorySystem.getAppCategory(appName),
        info: (categoryName) => categorySystem.getCategoryInfo(categoryName),
        all: () => categorySystem.getAllCategories(),
        stats: (apps) => categorySystem.getCategoryStats(apps),
        add: (appName, categoryName) => categorySystem.addMapping(appName, categoryName),
        debug: () => categorySystem.getDebugInfo(),
        definitions: CATEGORY_DEFINITIONS,
        mappings: APP_CATEGORY_MAPPINGS
    };

    // Analytics entegrasyonu
    if (typeof window.AnalyticsSystem !== 'undefined') {
        window.AnalyticsSystem.ready(() => {
            console.log('🔗 Categories sistem Analytics ile entegre edildi');
        });
    }

    // Debug konsol komutları
    if (window.location.hostname === 'localhost' || 
        window.location.hostname === '127.0.0.1' || 
        window.location.hostname.includes('192.168.')) {
        
        window.categoryDebug = {
            stats: (apps) => categorySystem.getCategoryStats(apps || window.apps),
            find: (appName) => categorySystem.getAppCategory(appName),
            detect: (appName) => categorySystem.detectCategoryFromName(appName),
            add: (appName, categoryName) => categorySystem.addMapping(appName, categoryName),
            info: () => categorySystem.getDebugInfo(),
            test: () => {
                console.log('🧪 Kategori sistemi test ediliyor...');
                const testApps = [
                    { name: 'Discord' },
                    { name: 'Visual Studio Code' },
                    { name: 'Unknown App' },
                    { name: 'Test Browser' }
                ];
                return categorySystem.applyCategoriesToApps(testApps);
            }
        };
        
        console.log('🧪 Category Debug fonksiyonları yüklendi: window.categoryDebug');
    }

    console.log('✅ Categories.js yüklendi ve hazır');
    
    // Sistem durumu logla
    setTimeout(() => {
        console.log('🗂️ Kategori sistemi durumu:', {
            categories: Object.keys(CATEGORY_DEFINITIONS).length,
            mappings: Object.keys(APP_CATEGORY_MAPPINGS).length,
            isGlobal: typeof window.applyCategoriesTo !== 'undefined'
        });
    }, 100);

})();
