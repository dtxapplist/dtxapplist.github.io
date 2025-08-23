// Optimized Asset Loader for Linux App Hub
// CSS'i önce yükler, performansı artırır

(function() {
    const modules = [
        'style',
        'apps', 
        'script',
        'copyp',
        'theme',
        'search'
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

    // Load data files (apps.js)
    async function loadDataFiles() {
        console.log('📊 Loading data files');
        const dataPromises = modules.map(async (module) => {
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

    // Initialize app
    function initializeApp() {
        const perfEnd = performance.now();
        console.log(`⚡ Total loading time: ${Math.round(perfEnd - perfStart)}ms`);
        
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
            
            // 2. Load data files
            await loadDataFiles();
            
            // 3. Load script files
            await loadScriptFiles();
            
            // 4. Initialize
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
