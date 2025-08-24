// Optimized Asset Loader for Linux App Hub
// CSS'i önce yükler, performansı artırır

(function() {
    const modules = [
        'style',
        'apps', 
        'script',
        'copyp',
        'theme',
        'search',
        'categories' // Yeni kategori modülü eklendi
    ];

    // Performance monitoring
    const perfStart = performance.now();
    
    // Cache for loaded files
    const loadedFiles = new Set();
    
    // Batch load CSS files immediately
    async function loadAllCSS() {
        console.log('🎨 CSS batch loading started');
        const cssPromises = modules.map(async (module) => {
            const cssPath = `assest/css/${module}.css`;
            
            if (loadedFiles.has(cssPath)) return;
            
            try {
                // Check if file exists first
                const response = await fetch(cssPath, { method: 'HEAD' });
                if (response.ok) {
                    return new Promise((resolve, reject) => {
                        const link = document.createElement('link');
                        link.rel = 'stylesheet';
                        link.href = cssPath;
                        
                        link.onload = () => {
                            console.log(`✅ ${module}.css loaded`);
                            loadedFiles.add(cssPath);
                            resolve();
                        };
                        
                        link.onerror = () => {
                            console.log(`⚠️ ${module}.css failed to load`);
                            reject();
                        };
                        
                        document.head.appendChild(link);
                    });
                }
            } catch (error) {
                console.log(`📄 ${module}.css not found`);
            }
        });

        // Wait for all CSS to load
        await Promise.allSettled(cssPromises);
        console.log('🎨 All CSS files processed');
    }

    // Load JS files
    async function loadJS(modulePath, moduleName) {
        if (loadedFiles.has(modulePath)) return false;
        
        try {
            const response = await fetch(modulePath, { method: 'HEAD' });
            if (response.ok) {
                return new Promise((resolve, reject) => {
                    const script = document.createElement('script');
                    script.src = modulePath;
                    
                    script.onload = () => {
                        console.log(`✅ ${moduleName} loaded`);
                        loadedFiles.add(modulePath);
                        resolve(true);
                    };
                    
                    script.onerror = () => {
                        console.log(`⚠️ ${moduleName} failed to load`);
                        reject(false);
                    };
                    
                    document.head.appendChild(script);
                });
            }
        } catch (error) {
            console.log(`📄 ${moduleName} not found`);
            return false;
        }
        return false;
    }

    // Load data files (categories.js ve apps.js)
    async function loadDataFiles() {
        console.log('📊 Loading data files');
        
        // ÖNEMLİ: Önce categories.js'yi yükle, sonra apps.js'yi yükle
        try {
            // 1. Önce categories.js'yi yükle
            console.log('📂 categories.js yükleniyor...');
            await loadJS('assest/app/categories.js', 'categories.js (data)');
            
            // Kategorilerin yüklendiğini kontrol et
            if (typeof window.appCategories !== 'undefined') {
                console.log('✅ Kategoriler başarıyla yüklendi:', Object.keys(window.appCategories).length, 'kategori');
            } else {
                console.warn('⚠️ Kategoriler yüklenemedi!');
            }
            
            // 2. Sonra apps.js'yi yükle
            console.log('📊 apps.js yükleniyor...');
            await loadJS('assest/app/apps.js', 'apps.js (data)');
            
            // Apps'in yüklendiğini kontrol et
            if (typeof window.apps !== 'undefined' || typeof apps !== 'undefined') {
                const appsArray = window.apps || apps;
                console.log('✅ Apps başarıyla yüklendi:', appsArray.length, 'uygulama');
                
                // Apps'i global yap
                if (typeof window.apps === 'undefined') {
                    window.apps = apps;
                }
            } else {
                console.error('❌ Apps yüklenemedi!');
            }
            
        } catch (error) {
            console.error('❌ Veri dosyalarını yüklerken hata:', error);
        }
        
        // Diğer modülleri paralel yükle
        const otherModules = modules.filter(m => !['categories', 'apps'].includes(m));
        const dataPromises = otherModules.map(async (module) => {
            const appPath = `assest/app/${module}.js`;
            return await loadJS(appPath, `${module}.js (data)`);
        });
        
        await Promise.allSettled(dataPromises);
    }

    // Load script files
    async function loadScriptFiles() {
        console.log('⚡ Loading script files');
        const scriptPromises = modules.map(async (module) => {
            const jsPath = `assest/js/${module}.js`;
            return await loadJS(jsPath, `${module}.js`);
        });
        
        await Promise.allSettled(scriptPromises);
    }

    // Initialize app with category processing
    function initializeApp() {
        const perfEnd = performance.now();
        console.log(`⚡ Total loading time: ${Math.round(perfEnd - perfStart)}ms`);
        
        // Kategorileri apps verisine uygula
        console.log('🔍 Kategori uygulama işlemi başlatılıyor...');
        
        // Gerekli fonksiyonların varlığını kontrol et
        const hasApplyFunction = typeof window.applyCategoriesTo === 'function';
        const hasAppsData = typeof window.apps !== 'undefined' || typeof apps !== 'undefined';
        const hasCategoriesData = typeof window.appCategories === 'object';
        
        console.log('📋 Kontrol sonuçları:');
        console.log(`- applyCategoriesTo fonksiyonu: ${hasApplyFunction ? '✅' : '❌'}`);
        console.log(`- apps verisi: ${hasAppsData ? '✅' : '❌'}`);
        console.log(`- appCategories verisi: ${hasCategoriesData ? '✅' : '❌'}`);
        
        if (hasApplyFunction && hasAppsData) {
            try {
                // Apps verisini al
                const appsArray = window.apps || apps;
                console.log(`📊 ${appsArray.length} uygulama kategorize edilecek`);
                
                // Kategorileri uygula
                window.apps = window.applyCategoriesTo(appsArray);
                console.log('✅ Kategoriler başarıyla uygulandı');
                
                // Sonuçları kontrol et
                const categorizedCount = window.apps.filter(app => app.category && app.category !== 'Diğer').length;
                const totalCount = window.apps.length;
                console.log(`📈 Kategorizasyon sonucu: ${categorizedCount}/${totalCount} uygulama kategorize edildi`);
                
                // Kategori dağılımını göster
                if (typeof window.getCategoryCounts === 'function') {
                    const counts = window.getCategoryCounts(window.apps);
                    console.log('📊 Kategori dağılımı:', counts);
                }
                
            } catch (error) {
                console.error('❌ Kategorileri uygularken hata:', error);
            }
        } else {
            console.warn('⚠️ Kategorizasyon atlandı - gerekli veriler eksik');
        }
        
        // Hide loading indicator if exists
        const loadingIndicator = document.getElementById('loading-indicator');
        if (loadingIndicator) {
            loadingIndicator.style.display = 'none';
        }
        
        // Show main content
        const mainContent = document.getElementById('main-content');
        if (mainContent) {
            mainContent.style.opacity = '1';
        }
        
        // Initialize main app
        if (typeof window.initLinuxAppHub === 'function') {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', window.initLinuxAppHub);
            } else {
                setTimeout(window.initLinuxAppHub, 100);
            }
        } else {
            console.warn('⚠️ initLinuxAppHub function not found');
        }
    }

    // Main loading sequence
    async function loadAll() {
        console.log('📦 Optimized asset loading started');
        
        try {
            // 1. Load CSS first (parallel)
            await loadAllCSS();
            
            // 2. Load data files (categories.js önce, sonra apps.js - SIRALI)
            await loadDataFiles();
            
            // Veri yükleme sonrası kontrol
            console.log('🔍 Yüklenen veriler kontrolü:');
            console.log('- window.appCategories:', typeof window.appCategories);
            console.log('- window.applyCategoriesTo:', typeof window.applyCategoriesTo);
            console.log('- apps:', typeof apps !== 'undefined' ? apps.length + ' uygulama' : 'undefined');
            console.log('- window.apps:', typeof window.apps !== 'undefined' ? window.apps.length + ' uygulama' : 'undefined');
            
            // 3. Load script files
            await loadScriptFiles();
            
            // 4. Initialize with category processing
            initializeApp();
            
        } catch (error) {
            console.error('❌ Loading error:', error);
            
            // Fallback: still try to initialize
            setTimeout(initializeApp, 1000);
        }
    }

    // Start loading when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadAll);
    } else {
        loadAll();
    }
    
})();
