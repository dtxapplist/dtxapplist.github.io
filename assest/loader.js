// Optimized Asset Loader for Linux App Hub
// CSS'i önce yükler, kategori sistemini daha güvenilir yapar

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
    
    // Debug logging
    function debugLog(message, data = null) {
        console.log(`🔧 [LOADER] ${message}`, data || '');
    }
    
    // Batch load CSS files immediately
    async function loadAllCSS() {
        debugLog('CSS batch loading started');
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
                            debugLog(`${module}.css loaded`);
                            loadedFiles.add(cssPath);
                            resolve();
                        };
                        
                        link.onerror = () => {
                            debugLog(`${module}.css failed to load`);
                            reject();
                        };
                        
                        document.head.appendChild(link);
                    });
                }
            } catch (error) {
                debugLog(`${module}.css not found`);
            }
        });

        // Wait for all CSS to load
        await Promise.allSettled(cssPromises);
        debugLog('All CSS files processed');
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
                        debugLog(`${moduleName} loaded`);
                        loadedFiles.add(modulePath);
                        resolve(true);
                    };
                    
                    script.onerror = () => {
                        debugLog(`${moduleName} failed to load`);
                        reject(false);
                    };
                    
                    document.head.appendChild(script);
                });
            }
        } catch (error) {
            debugLog(`${moduleName} not found`);
            return false;
        }
        return false;
    }

    // Load data files (categories.js ve apps.js) - GELİŞTİRİLDİ
    async function loadDataFiles() {
        debugLog('Loading data files');
        
        try {
            // 1. Önce categories.js'yi yükle - assest/app/ klasöründen
            debugLog('Loading categories.js...');
            await loadJS('assest/app/categories.js', 'categories.js (data)');
            
            // Kategorilerin yüklendiğini kontrol et - DAHA DETAYLI
            await new Promise(resolve => setTimeout(resolve, 100)); // Kısa bekle
            
            if (typeof window.appCategories !== 'undefined') {
                debugLog('Categories loaded successfully', {
                    count: Object.keys(window.appCategories).length,
                    hasApplyFunction: typeof window.applyCategoriesTo === 'function'
                });
                
                // Bazı örnek kategorileri logla
                const sampleCategories = Object.keys(window.appCategories).slice(0, 5);
                debugLog('Sample categories:', sampleCategories);
            } else {
                console.warn('⚠️ Categories loading failed!');
            }
            
            // 2. Sonra apps.js'yi yükle - assest/app/ klasöründen
            debugLog('Loading apps.js...');
            await loadJS('assest/app/apps.js', 'apps.js (data)');
            
            // Apps'in yüklendiğini kontrol et - DAHA DETAYLI
            await new Promise(resolve => setTimeout(resolve, 100)); // Kısa bekle
            
            if (typeof window.apps !== 'undefined' || typeof apps !== 'undefined') {
                const appsArray = window.apps || apps;
                debugLog('Apps loaded successfully', {
                    count: appsArray.length,
                    firstApp: appsArray[0]?.name || 'undefined'
                });
                
                // Apps'i global yap
                if (typeof window.apps === 'undefined') {
                    window.apps = apps;
                    debugLog('Apps made global');
                }
            } else {
                console.error('❌ Apps loading failed!');
            }
            
        } catch (error) {
            console.error('❌ Error loading data files:', error);
        }
        
        // Diğer modülleri paralel yükle - assest/app/ klasöründen
        const otherModules = modules.filter(m => !['categories', 'apps'].includes(m));
        const dataPromises = otherModules.map(async (module) => {
            const appPath = `assest/app/${module}.js`;
            return await loadJS(appPath, `${module}.js (data)`);
        });
        
        await Promise.allSettled(dataPromises);
    }

    // Load script files
    async function loadScriptFiles() {
        debugLog('Loading script files');
        const scriptPromises = modules.map(async (module) => {
            const jsPath = `assest/js/${module}.js`;
            return await loadJS(jsPath, `${module}.js`);
        });
        
        await Promise.allSettled(scriptPromises);
    }

    // Apply categories to apps data - YENİ FONKSİYON
    function applyCategoriesWithValidation() {
        debugLog('Applying categories with validation...');
        
        const hasApplyFunction = typeof window.applyCategoriesTo === 'function';
        const hasAppsData = typeof window.apps !== 'undefined' || typeof apps !== 'undefined';
        const hasCategoriesData = typeof window.appCategories === 'object';
        
        debugLog('Pre-application check:', {
            applyCategoriesTo: hasApplyFunction,
            appsData: hasAppsData,
            categoriesData: hasCategoriesData
        });
        
        if (hasApplyFunction && hasAppsData) {
            try {
                // Apps verisini al
                const appsArray = window.apps || apps;
                debugLog(`Applying categories to ${appsArray.length} apps`);
                
                // Kategorileri uygula
                const categorizedApps = window.applyCategoriesTo(appsArray);
                window.apps = categorizedApps;
                
                debugLog('Categories applied successfully');
                
                // Sonuçları kontrol et
                const categorizedCount = window.apps.filter(app => app.category && app.category !== 'Diğer').length;
                const totalCount = window.apps.length;
                
                debugLog('Categorization results:', {
                    total: totalCount,
                    categorized: categorizedCount,
                    percentage: Math.round((categorizedCount / totalCount) * 100) + '%'
                });
                
                // Kategori dağılımını göster
                if (typeof window.getCategoryCounts === 'function') {
                    const counts = window.getCategoryCounts(window.apps);
                    debugLog('Category distribution:', counts);
                }
                
                // İlk 5 uygulamanın kategorilerini kontrol et
                debugLog('Sample categorized apps:');
                window.apps.slice(0, 5).forEach(app => {
                    console.log(`  📱 ${app.name}: ${app.category || 'No category'}`);
                });
                
                return true;
                
            } catch (error) {
                console.error('❌ Error applying categories:', error);
                return false;
            }
        } else {
            console.warn('⚠️ Cannot apply categories - missing dependencies:', {
                applyCategoriesTo: hasApplyFunction,
                appsData: hasAppsData,
                categoriesData: hasCategoriesData
            });
            return false;
        }
    }

    // Initialize app with category processing
    function initializeApp() {
        const perfEnd = performance.now();
        debugLog(`Total loading time: ${Math.round(perfEnd - perfStart)}ms`);
        
        // Apply categories with validation
        debugLog('Starting category application process');
        const categoriesApplied = applyCategoriesWithValidation();
        
        if (categoriesApplied) {
            debugLog('✅ Categories successfully applied');
        } else {
            debugLog('⚠️ Category application failed or skipped');
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
            debugLog('Initializing main app');
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', window.initLinuxAppHub);
            } else {
                // Biraz daha bekle ki her şey hazır olsun
                setTimeout(() => {
                    debugLog('Calling initLinuxAppHub');
                    window.initLinuxAppHub();
                }, 200);
            }
        } else {
            console.warn('⚠️ initLinuxAppHub function not found');
        }
    }

    // Main loading sequence - GELİŞTİRİLDİ
    async function loadAll() {
        debugLog('Optimized asset loading started');
        
        try {
            // 1. Load CSS first (parallel)
            debugLog('Phase 1: Loading CSS files');
            await loadAllCSS();
            
            // 2. Load data files (categories.js önce, sonra apps.js - SIRALI)
            debugLog('Phase 2: Loading data files');
            await loadDataFiles();
            
            // Veri yükleme sonrası detaylı kontrol
            debugLog('Post-data-loading check:');
            console.log('🔍 Loaded data status:');
            console.log('  - window.appCategories:', typeof window.appCategories, 
                typeof window.appCategories === 'object' ? `(${Object.keys(window.appCategories).length} items)` : '');
            console.log('  - window.applyCategoriesTo:', typeof window.applyCategoriesTo);
            console.log('  - apps:', typeof apps !== 'undefined' ? `(${apps.length} items)` : 'undefined');
            console.log('  - window.apps:', typeof window.apps !== 'undefined' ? `(${window.apps.length} items)` : 'undefined');
            
            // 3. Load script files
            debugLog('Phase 3: Loading script files');
            await loadScriptFiles();
            
            // 4. Initialize with category processing
            debugLog('Phase 4: Initializing app');
            initializeApp();
            
        } catch (error) {
            console.error('❌ Loading error:', error);
            
            // Fallback: still try to initialize
            debugLog('Attempting fallback initialization');
            setTimeout(initializeApp, 1000);
        }
    }

    // Start loading when DOM is ready
    debugLog('DOM ready check');
    if (document.readyState === 'loading') {
        debugLog('DOM still loading, waiting for DOMContentLoaded');
        document.addEventListener('DOMContentLoaded', loadAll);
    } else {
        debugLog('DOM already ready, starting load immediately');
        loadAll();
    }
    
})();
