// Dynamic Asset Loader for Linux App Hub
// Automatically loads CSS and JS files from assets folder

(function() {
    const config = {
        css: [
            'style'  // assest/css/style.css
        ],
        app: [
            'apps'  // assest/app/apps.js
        ],
        js: [
            'script'  // assest/js/script.js
        ]
    };

    console.log('📦 Asset loader başlatıldı...');

    // CSS dosyalarını yükle
    config.css.forEach(name => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = `assest/css/${name}.css`;
        link.onerror = () => console.error(`❌ CSS dosyası yüklenemedi: ${name}.css`);
        link.onload = () => console.log(`✅ CSS yüklendi: ${name}.css`);
        document.head.appendChild(link);
    });

    // Önce app dosyalarını yükle (apps.js gibi veri dosyaları)
    let loadedAppFiles = 0;
    const totalAppFiles = config.app.length;

    function loadJSFiles() {
        // JS dosyalarını yükle
        config.js.forEach((name, index) => {
            const script = document.createElement('script');
            script.src = `assest/js/${name}.js`;
            script.onerror = () => console.error(`❌ JS dosyası yüklenemedi: ${name}.js`);
            script.onload = () => {
                console.log(`✅ JS yüklendi: ${name}.js`);
                
                // Son JS dosyası yüklendiğinde tüm yükleme tamamlandı
                if (index === config.js.length - 1) {
                    console.log('🚀 Tüm dosyalar başarıyla yüklendi!');
                    
                    // DOM hazır olduğunda script.js'deki kodu çalıştır
                    if (document.readyState === 'loading') {
                        document.addEventListener('DOMContentLoaded', initializeApp);
                    } else {
                        initializeApp();
                    }
                }
            };
            document.head.appendChild(script);
        });
    }

    function initializeApp() {
        // script.js yüklendikten sonra main fonksiyonu varsa çalıştır
        if (typeof window.initLinuxAppHub === 'function') {
            window.initLinuxAppHub();
        }
    }

    // App dosyalarını sırayla yükle
    if (totalAppFiles > 0) {
        config.app.forEach(name => {
            const script = document.createElement('script');
            script.src = `assest/app/${name}.js`;
            script.onerror = () => console.error(`❌ App dosyası yüklenemedi: ${name}.js`);
            script.onload = () => {
                console.log(`✅ App dosyası yüklendi: ${name}.js`);
                loadedAppFiles++;
                if (loadedAppFiles === totalAppFiles) {
                    // Tüm app dosyaları yüklendikten sonra JS dosyalarını yükle
                    loadJSFiles();
                }
            };
            document.head.appendChild(script);
        });
    } else {
        // App dosyası yoksa direkt JS dosyalarını yükle
        loadJSFiles();
    }
})();
