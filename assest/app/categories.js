// Linux App Hub - Uygulama Kategorileri
// Bu dosya uygulamalara kategori etiketleri atar

const appCategories = {
    // İletişim Uygulamaları
    "Discord": "İletişim",
    "Telegram": "İletişim",
    "WhatsApp": "İletişim",
    "TeamSpeak": "İletişim",
    "Revolt": "İletişim",
    "Zoom": "İletişim",

    // Web Tarayıcıları
    "Chromium": "İnternet",
    "Google Chrome": "İnternet",
    "Mozilla Firefox": "İnternet",
    "LibreWolf": "İnternet",
    "Opera": "İnternet",
    "Microsoft Edge": "İnternet",
    "Brave": "İnternet",
    "Zen Browser": "İnternet",
    "Vivaldi": "İnternet",
    "Tor Browser": "İnternet",

    // Geliştirme Araçları
    "Visual Studio Code": "Geliştirme",
    "IntelliJ IDEA": "Geliştirme",
    "PyCharm": "Geliştirme",
    "CLion": "Geliştirme",
    "WebStorm": "Geliştirme",
    "Rider": "Geliştirme",
    "GitHub Desktop": "Geliştirme",
    "Sublime Text": "Geliştirme",
    "Electron": "Geliştirme",

    // Oyun ve Eğlence
    "Steam": "Oyun",
    "Epic Games Launcher": "Oyun",
    "Heroic Games Launcher": "Oyun",
    "Unity Hub": "Oyun",
    "Scratch": "Eğitim",

    // Multimedya
    "VLC": "Multimedya",
    "Spotify": "Multimedya",
    "TIDAL Hi-Fi": "Multimedya",
    "Audacity": "Multimedya",

    // Grafik ve Tasarım
    "Adobe Photoshop": "Grafik & Tasarım",
    "Adobe Illustrator": "Grafik & Tasarım",
    "Adobe Lightroom": "Grafik & Tasarım",
    "Adobe Premiere Pro": "Grafik & Tasarım",
    "Adobe Dreamweaver": "Grafik & Tasarım",
    "Adobe Edge Animate": "Grafik & Tasarım",
    "GIMP": "Grafik & Tasarım",
    "Krita": "Grafik & Tasarım",
    "Blender": "Grafik & Tasarım",
    "Figma Desktop": "Grafik & Tasarım",

    // Ofis Uygulamaları
    "Microsoft Office": "Ofis",
    "LibreOffice": "Ofis",
    "OnlyOffice": "Ofis",

    // E-posta
    "Thunderbird": "E-posta",

    // Güvenlik
    "1Password": "Güvenlik",
    "KeePass": "Güvenlik",
    "Bitwarden": "Güvenlik",
    "Proton VPN": "Güvenlik",

    // Sistem Araçları
    "VirtualBox": "Sistem",
    "VMware Workstation": "Sistem",
    "WinRAR": "Sistem",
    "PeaZip": "Sistem",
    "UBinary": "Sistem",
    "Syncthing": "Sistem",

    // Uzaktan Erişim
    "TeamViewer": "Uzaktan Erişim",
    "AnyDesk": "Uzaktan Erişim",
    "RustDesk": "Uzaktan Erişim",

    // CAD ve Mühendislik
    "AutoCAD": "CAD & Mühendislik",
    "FreeCAD": "CAD & Mühendislik",
    "LibreCAD": "CAD & Mühendislik",

    // Not Alma
    "Obsidian": "Not Alma",
    "RemNote": "Not Alma",

    // Çalışma Zamanı
    "Adobe AIR": "Çalışma Zamanı",
    "Riot Games": "Oyun"
};

// Kategorileri uygulama verilerine uygulayan fonksiyon
function applyCategoriesTo(appsArray) {
    if (!Array.isArray(appsArray)) {
        console.warn('⚠️ applyCategoriesTo: Geçersiz apps array');
        return appsArray;
    }

    return appsArray.map(app => {
        const category = appCategories[app.name];
        
        return {
            ...app,
            category: category || 'Diğer' // Kategori bulunamazsa 'Diğer' ata
        };
    });
}

// Mevcut kategorileri al
function getAvailableCategories() {
    const categories = [...new Set(Object.values(appCategories))];
    return categories.sort((a, b) => a.localeCompare(b, 'tr', { sensitivity: 'base' }));
}

// Kategoriye göre uygulama sayısını hesapla
function getCategoryCounts(appsArray) {
    if (!Array.isArray(appsArray)) return {};
    
    const counts = {};
    appsArray.forEach(app => {
        const category = app.category || 'Diğer';
        counts[category] = (counts[category] || 0) + 1;
    });
    
    return counts;
}

// Global olarak erişilebilir yap
window.appCategories = appCategories;
window.applyCategoriesTo = applyCategoriesTo;
window.getAvailableCategories = getAvailableCategories;
window.getCategoryCounts = getCategoryCounts;

console.log('📂 Kategori sistemi yüklendi:', Object.keys(appCategories).length, 'uygulama kategorize edildi');
