// Simple Auto-Loading Asset Loader for Linux App Hub
// Otomatik olarak aynı isimli CSS ve JS dosyalarını yükler

(function() {
    // Yüklenecek modüller - sadece dosya adını ekle, hem CSS hem JS otomatik yüklenecek
    const modules = [
        'style',    // style.css + style.js (eğer varsa)
        'apps',     // apps.css (eğer varsa) + apps.js
        'script',   // script.css (eğer varsa) + script.js
        'copyp',    // copyp.css + copyp.js
        'theme',    // theme.css + theme.js
        'search',   // search.css + search.js
        // Yeni modül eklemek için buraya adını yaz
    ];

    let loadedCount = 0;
    let totalFiles = 0;
    let jsFilesToLoad = [];

    // Dosya var mı kontrol et
    async function fileExists(url) {
        try {
            const response = await fetch(url, { method: 'HEAD' });
            return response.ok;
        } catch {
            return false;
        }
    }

    // CSS dosyasını yükle
    function loadCSS(moduleName) {
        return new Promise(async (resolve) => {
            const cssPath = `assest/css/${moduleName}.css`;
            
            if (await fileExists(cssPath)) {
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = cssPath;
                
                link.onload = () => {
                    console.log(`✅ ${moduleName}.css yüklendi`);
                    resolve(true);
                };
                
                link.onerror = () => {
                    console.log(`⚠️ ${moduleName}.css yüklenemedi`);
                    resolve(false);
                };
                
                document.head.appendChild(link);
            } else {
                console.log(`📄 ${moduleName}.css bulunamadı`);
                resolve(false);
            }
        });
    }

    // JS dosyasını yükle
    function loadJS(moduleName) {
        return new Promise(async (resolve) => {
            const jsPath = `assest/js/${moduleName}.js`;
            
            if (await fileExists(jsPath)) {
                const script = document.createElement('script');
                script.src = jsPath;
                
                script.onload = () => {
                    console.log(`✅ ${moduleName}.js yüklendi`);
                    resolve(true);
                };
                
                script.onerror = () => {
                    console.log(`⚠️ ${moduleName}.js yüklenemedi`);
                    resolve(false);
                };
                
                document.head.appendChild(script);
            } else {
                console.log(`📄 ${moduleName}.js bulunamadı`);
                resolve(false);
            }
        });
    }

    // App dosyasını yükle (özel durum - assest/app/ klasöründe)
    function loadApp(moduleName) {
        return new Promise(async (resolve) => {
            const appPath = `assest/app/${moduleName}.js`;
            
            if (await fileExists(appPath)) {
                const script = document.createElement('script');
                script.src = appPath;
                
                script.onload = () => {
                    console.log(`✅ ${moduleName}.js (app) yüklendi`);
                    resolve(true);
                };
                
                script.onerror = () => {
                    console.log(`⚠️ ${moduleName}.js (app) yüklenemedi`);
                    resolve(false);
                };
                
                document.head.appendChild(script);
            } else {
                console.log(`📄 ${moduleName}.js (app) bulunamadı`);
                resolve(false);
            }
        });
    }

    // Ana yükleme fonksiyonu
    async function loadModules() {
        console.log('📦 Modüller yükleniyor...');

        // 1. Önce tüm CSS dosyalarını yükle
        console.log('🎨 CSS dosyaları yükleniyor...');
        for (const module of modules) {
            await loadCSS(module);
        }

        // 2. Sonra app dosyalarını yükle (veri dosyaları)
        console.log('📊 App dosyaları yükleniyor...');
        for (const module of modules) {
            await loadApp(module);
        }

        // 3. Son olarak JS dosyalarını yükle
        console.log('⚡ JS dosyaları yükleniyor...');
        for (const module of modules) {
            await loadJS(module);
        }

        // 4. Uygulama başlatma
        console.log('🚀 Tüm modüller yüklendi!');
        initializeApp();
    }

    function initializeApp() {
        // script.js yüklendikten sonra main fonksiyonu varsa çalıştır
        if (typeof window.initLinuxAppHub === 'function') {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', window.initLinuxAppHub);
            } else {
                window.initLinuxAppHub();
            }
        }
    }

    // Loader'ı başlat
    loadModules();
})();
