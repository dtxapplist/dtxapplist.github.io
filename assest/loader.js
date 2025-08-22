// Dynamic Asset Loader for Linux App Hub
// Automatically loads CSS and JS files from assets folder

(function() {
    const config = {
        css: [
            'main'  // assets/css/main.css (eski style.css)
        ],
        app: [
            'apps'  // assets/app/apps.js
        ],
        js: [
            'main'  // assets/js/main.js (eski script.js)
        ]
    };

    // CSS dosyalarını yükle
    config.css.forEach(name => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = `assets/css/${name}.css`;
        link.onerror = () => console.error(`CSS dosyası yüklenemedi: ${name}.css`);
        document.head.appendChild(link);
    });

    // Önce app dosyalarını yükle (apps.js gibi veri dosyaları)
    let loadedAppFiles = 0;
    const totalAppFiles = config.app.length;

    function loadJSFiles() {
        // JS dosyalarını yükle
        config.js.forEach((name, index) => {
            const script = document.createElement('script');
            script.src = `assets/js/${name}.js`;
            script.onerror = () => console.error(`JS dosyası yüklenemedi: ${name}.js`);
            
            // Son JS dosyası yüklendiğinde console'a bilgi ver
            if (index === config.js.length - 1) {
                script.onload = () => {
                    console.log('🚀 Tüm dosyalar başarıyla yüklendi!');
                };
            }
            
            document.head.appendChild(script);
        });
    }

    // App dosyalarını sırayla yükle
    config.app.forEach(name => {
        const script = document.createElement('script');
        script.src = `assets/app/${name}.js`;
        script.onerror = () => console.error(`App dosyası yüklenemedi: ${name}.js`);
        script.onload = () => {
            loadedAppFiles++;
            if (loadedAppFiles === totalAppFiles) {
                // Tüm app dosyaları yüklendikten sonra JS dosyalarını yükle
                loadJSFiles();
            }
        };
        document.head.appendChild(script);
    });

    console.log('📦 Asset loader başlatıldı...');
})();
