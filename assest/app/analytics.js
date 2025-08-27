// assest/app/analytics.js - Düzeltilmiş Versiyon
// Bu dosyayı mevcut analytics.js dosyanızın yerine koyun

window.AnalyticsSystem = (function() {
    'use strict';
    
    console.log('📊 Analytics System başlatılıyor...');
    
    // Vercel Analytics konfigürasyonu
    const VERCEL_ANALYTICS_CONFIG = {
        endpoint: '/_vercel/insights/speed',
        vitals: '/_vercel/insights/vitals'
    };
    
    // Local storage keys
    const STORAGE_KEYS = {
        appViews: 'linux_hub_app_views',
        popularApps: 'linux_hub_popular_apps',
        lastSync: 'linux_hub_last_sync',
        sessionId: 'linux_hub_session_id'
    };
    
    // Session management
    let sessionId = null;
    let pageLoadTime = Date.now();
    let buttonAddAttempts = 0;
    const maxButtonAttempts = 10;
    
    // Initialize session
    function initSession() {
        sessionId = sessionStorage.getItem(STORAGE_KEYS.sessionId);
        if (!sessionId) {
            sessionId = 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            sessionStorage.setItem(STORAGE_KEYS.sessionId, sessionId);
        }
        console.log('📊 Session başlatıldı:', sessionId);
    }
    
    // Vercel Analytics entegrasyonu
    function initVercelAnalytics() {
        // Vercel Analytics zaten yüklenmiş mi kontrol et
        if (typeof window.va !== 'undefined') {
            console.log('✅ Vercel Analytics zaten mevcut');
            return;
        }
        
        // Analytics'e sayfa görüntüleme gönder
        setTimeout(() => {
            if (typeof window.va !== 'undefined') {
                window.va('pageview', {
                    page: window.location.pathname,
                    title: document.title,
                    session: sessionId
                });
            }
        }, 2000);
    }
    
    // Local storage'dan veri al
    function getStoredData(key, defaultValue = {}) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : defaultValue;
        } catch (error) {
            console.warn('Storage okuma hatası:', error);
            return defaultValue;
        }
    }
    
    // Local storage'a veri kaydet
    function setStoredData(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            return true;
        } catch (error) {
            console.warn('Storage yazma hatası:', error);
            return false;
        }
    }
    
    // Uygulama görüntüleme sayacı
    function trackAppView(appName, action = 'view') {
        const viewData = getStoredData(STORAGE_KEYS.appViews, {});
        const today = new Date().toISOString().split('T')[0];
        
        if (!viewData[today]) {
            viewData[today] = {};
        }
        
        if (!viewData[today][appName]) {
            viewData[today][appName] = { view: 0, install: 0, about: 0 };
        }
        
        viewData[today][appName][action]++;
        
        setStoredData(STORAGE_KEYS.appViews, viewData);
        
        // Vercel Analytics'e gönder
        if (typeof window.va !== 'undefined') {
            window.va('track', `app_${action}`, {
                app: appName,
                session: sessionId,
                timestamp: Date.now()
            });
        }
        
        console.log(`📊 ${appName} - ${action} tracked`);
        
        // Popüler uygulamaları güncelle
        updatePopularApps();
        updatePopularButton();
    }
    
    // Popüler uygulamaları hesapla
    function calculatePopularApps(days = 7) {
        const viewData = getStoredData(STORAGE_KEYS.appViews, {});
        const popularApps = {};
        const now = new Date();
        
        // Son N günün verilerini topla
        for (let i = 0; i < days; i++) {
            const date = new Date(now);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            
            if (viewData[dateStr]) {
                Object.keys(viewData[dateStr]).forEach(appName => {
                    if (!popularApps[appName]) {
                        popularApps[appName] = { 
                            views: 0, 
                            installs: 0, 
                            abouts: 0, 
                            score: 0,
                            name: appName
                        };
                    }
                    
                    const appData = viewData[dateStr][appName];
                    popularApps[appName].views += appData.view || 0;
                    popularApps[appName].installs += appData.install || 0;
                    popularApps[appName].abouts += appData.about || 0;
                    
                    // Popülerlik skoru hesapla (view: 1p, about: 2p, install: 3p)
                    popularApps[appName].score = 
                        (popularApps[appName].views * 1) + 
                        (popularApps[appName].abouts * 2) + 
                        (popularApps[appName].installs * 3);
                });
            }
        }
        
        // Skora göre sırala
        const sortedApps = Object.values(popularApps)
            .filter(app => app.score > 0)
            .sort((a, b) => b.score - a.score)
            .slice(0, 10);
        
        return sortedApps;
    }
    
    // Popüler uygulamaları güncelle ve sakla
    function updatePopularApps() {
        const popularApps = calculatePopularApps(7);
        setStoredData(STORAGE_KEYS.popularApps, {
            apps: popularApps,
            lastUpdated: Date.now()
        });
        
        // Event dispatch et
        window.dispatchEvent(new CustomEvent('popularAppsUpdated', {
            detail: { popularApps }
        }));
    }
    
    // Popüler uygulamaları al
    function getPopularApps() {
        const data = getStoredData(STORAGE_KEYS.popularApps, { apps: [], lastUpdated: 0 });
        
        // Eğer 1 saatten eski ise yeniden hesapla
        if (Date.now() - data.lastUpdated > 3600000) {
            updatePopularApps();
            return getStoredData(STORAGE_KEYS.popularApps, { apps: [] }).apps;
        }
        
        return data.apps || [];
    }
    
    // Popüler butonun metnini güncelle
    function updatePopularButton() {
        const button = document.getElementById('popular-apps-btn');
        if (button) {
            const popularApps = getPopularApps();
            const numberSpan = button.querySelector('.stat-number');
            if (numberSpan) {
                if (popularApps.length > 0) {
                    numberSpan.textContent = popularApps.length.toString();
                } else {
                    numberSpan.textContent = 'TOP';
                }
            }
        }
    }
    
    // Popüler uygulamalar popup'ını oluştur
    function createPopularAppsPopup() {
        console.log('🔥 Popüler uygulamalar popup oluşturuluyor...');
        
        const popularApps = getPopularApps();
        const appsData = window.apps || [];
        
        // Popup'ın zaten var olup olmadığını kontrol et
        let popup = document.getElementById('popular-apps-popup');
        if (!popup) {
            popup = document.createElement('div');
            popup.id = 'popular-apps-popup';
            popup.className = 'popup hidden';
            document.body.appendChild(popup);
        }
        
        // Popup içeriği
        let popularAppsHtml = '';
        
        if (popularApps.length === 0) {
            popularAppsHtml = `
                <div class="no-popular-apps">
                    <div class="no-results-icon">📊</div>
                    <h3>Henüz Veri Yok</h3>
                    <p>Popüler uygulamalar için biraz uygulama görüntülemeye başlayın!</p>
                    <p><small>Birkaç uygulamaya tıklayın, kurulum talimatlarını görüntüleyin!</small></p>
                </div>
            `;
        } else {
            popularAppsHtml = '<div class="popular-apps-list">';
            
            popularApps.forEach((popular, index) => {
                const app = appsData.find(a => a.name === popular.name);
                if (!app) return;
                
                // Status belirle
                let statusClass = "green", statusText = "Destekleniyor", statusIcon = "✓";
                if (!app.supported) {
                    if (app.alternatives?.length > 0) {
                        statusClass = "orange";
                        statusText = "Alternatifler Mevcut";
                        statusIcon = "⚠";
                    } else {
                        statusClass = "red";
                        statusText = "Desteklenmiyor";
                        statusIcon = "✗";
                    }
                }
                
                // Icon
                const iconElement = app.icon ? 
                    `<img src="${app.icon}" alt="${app.name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">` 
                    : '';
                const fallbackIcon = `<div class="card-icon" ${iconElement ? 'style="display:none;"' : ''}>${app.name.charAt(0).toUpperCase()}</div>`;
                
                popularAppsHtml += `
                    <div class="popular-app-item" data-rank="${index + 1}">
                        <div class="popular-app-rank">#${index + 1}</div>
                        <div class="popular-app-header">
                            ${iconElement}
                            ${fallbackIcon}
                            <div class="popular-app-info">
                                <div class="app-name">${app.name}</div>
                                <div class="app-category">${app.category || 'Diğer'}</div>
                                <div class="status ${statusClass}">
                                    <span class="status-icon">${statusIcon}</span>
                                    ${statusText}
                                </div>
                            </div>
                        </div>
                        <div class="popular-app-stats">
                            <div class="stat-item">
                                <span class="stat-icon">👁️</span>
                                <span class="stat-value">${popular.views}</span>
                                <span class="stat-label">Görüntülenme</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-icon">ℹ️</span>
                                <span class="stat-value">${popular.abouts}</span>
                                <span class="stat-label">Detay</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-icon">📦</span>
                                <span class="stat-value">${popular.installs}</span>
                                <span class="stat-label">Kurulum</span>
                            </div>
                            <div class="stat-item score">
                                <span class="stat-icon">🔥</span>
                                <span class="stat-value">${popular.score}</span>
                                <span class="stat-label">Skor</span>
                            </div>
                        </div>
                        <div class="popular-app-actions">
                            ${app.supported ? `<button class="action-btn install-btn" onclick="window.AnalyticsSystem.trackAndShowApp('${app.name}', 'install')" title="Kurulum Talimatları">📦</button>` : ''}
                            <button class="action-btn about-btn" onclick="window.AnalyticsSystem.trackAndShowApp('${app.name}', 'about')" title="Hakkında">ℹ️</button>
                        </div>
                    </div>
                `;
            });
            
            popularAppsHtml += '</div>';
        }
        
        popup.innerHTML = `
            <div class="popup-content">
                <div class="popup-header">
                    <h2 class="popup-title">🔥 En Popüler Uygulamalar</h2>
                    <button class="popup-close" onclick="window.AnalyticsSystem.closePopularAppsPopup()">&times;</button>
                </div>
                <div class="popup-body">
                    <div class="popular-apps-header">
                        <p>Son 7 günün en çok ilgi gören uygulamaları (Toplam ${popularApps.length} uygulama)</p>
                        <div class="popular-apps-legend">
                            <span class="legend-item"><span class="stat-icon">👁️</span> Görüntülenme: 1 puan</span>
                            <span class="legend-item"><span class="stat-icon">ℹ️</span> Detay: 2 puan</span>
                            <span class="legend-item"><span class="stat-icon">📦</span> Kurulum: 3 puan</span>
                        </div>
                    </div>
                    ${popularAppsHtml}
                </div>
            </div>
        `;
        
        return popup;
    }
    
    // Popüler uygulamalar popup'ını göster
    function showPopularAppsPopup() {
        console.log('🔥 Popüler uygulamalar popup gösteriliyor...');
        
        const popup = createPopularAppsPopup();
        popup.classList.remove('hidden');
        popup.classList.add('visible');
        
        // Analytics track
        if (typeof window.va !== 'undefined') {
            window.va('track', 'popular_apps_viewed', {
                session: sessionId,
                timestamp: Date.now(),
                popular_count: getPopularApps().length
            });
        }
        
        console.log('✅ Popüler uygulamalar popup açıldı');
    }
    
    // Popüler uygulamalar popup'ını kapat
    function closePopularAppsPopup() {
        const popup = document.getElementById('popular-apps-popup');
        if (popup) {
            popup.classList.remove('visible');
            popup.classList.add('hidden');
            console.log('🔥 Popüler uygulamalar popup kapatıldı');
        }
    }
    
    // Uygulama track et ve göster
    function trackAndShowApp(appName, action) {
        trackAppView(appName, action);
        closePopularAppsPopup();
        
        // Ana uygulamada popup'ı göster
        setTimeout(() => {
            const app = (window.apps || []).find(a => a.name === appName);
            if (app) {
                // window.showAppPopup yerine direkt fonksiyonları çağır
                if (action === 'install' && app.supported && typeof window.showInstallPopup === 'function') {
                    window.showInstallPopup(app);
                } else if (typeof window.showAboutPopup === 'function') {
                    window.showAboutPopup(app);
                }
                // Fallback: main script'teki fonksiyonları dene
// analytics.js için düzeltme - addPopularButton fonksiyonunun iyileştirilmiş versiyonu

// Stats bölümüne popüler buton ekle - Çalışan versiyon
function addPopularButton() {
    const stats = document.getElementById('stats');
    if (!stats) {
        buttonAddAttempts++;
        if (buttonAddAttempts < maxButtonAttempts) {
            console.log(`⏳ Stats bölümü bulunamadı, deneme ${buttonAddAttempts}/${maxButtonAttempts}`);
            setTimeout(addPopularButton, 500);
        } else {
            console.warn('❌ Stats bölümü bulunamadı, popüler buton eklenemedi');
        }
        return;
    }
    
    // Zaten var mı kontrol et
    if (document.getElementById('popular-apps-btn')) {
        console.log('✅ Popüler uygulamalar butonu zaten mevcut');
        updatePopularButton();
        return;
    }
    
    const popularBtn = document.createElement('div');
    popularBtn.className = 'stat-item popular-btn';
    popularBtn.id = 'popular-apps-btn';
    popularBtn.title = 'En Popüler Uygulamalar - Tıklayın!';
    popularBtn.style.cursor = 'pointer';
    popularBtn.setAttribute('role', 'button');
    popularBtn.setAttribute('tabindex', '0');
    
    // İlk olarak mevcut verileri kontrol et
    const popularApps = getPopularApps();
    const buttonText = popularApps.length > 0 ? popularApps.length.toString() : 'TOP';
    
    popularBtn.innerHTML = `
        <span class="stat-icon">🔥</span>
        <span class="stat-number">${buttonText}</span>
    `;
    
    // Click event listener - Bu çok önemli!
    popularBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('🔥 Popüler buton tıklandı!');
        
        // Feedback için kısa titreşim efekti
        this.style.transform = 'translateY(-2px) scale(0.95)';
        setTimeout(() => {
            this.style.transform = '';
        }, 150);
        
        showPopularAppsPopup();
    });
    
    // Keyboard accessibility
    popularBtn.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this.click();
        }
    });
    
    // Touch events for mobile
    let touchStartTime = 0;
    popularBtn.addEventListener('touchstart', function(e) {
        touchStartTime = Date.now();
        this.style.transform = 'translateY(-2px) scale(0.98)';
    });
    
    popularBtn.addEventListener('touchend', function(e) {
        const touchDuration = Date.now() - touchStartTime;
        this.style.transform = '';
        
        // Prevent double-firing with click event
        if (touchDuration < 500) {
            e.preventDefault();
            this.click();
        }
    });
    
    // Hover efektleri (CSS ile de tanımlı ama JS ile de destekleyelim)
    popularBtn.addEventListener('mouseenter', function() {
        console.log('🔥 Popüler buton hover - in');
    });
    
    popularBtn.addEventListener('mouseleave', function() {
        console.log('🔥 Popüler buton hover - out');
    });
    
    // İstatistiklerin sonuna ekle
    stats.appendChild(popularBtn);
    
    // Force reflow to ensure the element is rendered
    popularBtn.offsetHeight;
    
    console.log('✅ Popüler uygulamalar butonu eklendi');
    console.log('📊 Button element:', popularBtn);
    console.log('📊 Button events:', {
        click: !!popularBtn.onclick,
        listeners: 'added'
    });
    
    // Analytics track
    if (typeof window.va !== 'undefined') {
        window.va('track', 'popular_button_added', {
            session: sessionId,
            timestamp: Date.now(),
            popular_count: popularApps.length
        });
    }
    
    // Test button click programmatically (for debugging)
    window.testPopularButton = function() {
        popularBtn.click();
    };
    
    return popularBtn;
}

// Popüler uygulamalar popup'ını göster - Geliştirilmiş versiyon
function showPopularAppsPopup() {
    console.log('🔥 Popüler uygulamalar popup gösteriliyor...');
    
    // Mevcut popup'ı kapat
    const existingPopup = document.getElementById('popular-apps-popup');
    if (existingPopup) {
        existingPopup.remove();
    }
    
    const popup = createPopularAppsPopup();
    popup.classList.remove('hidden');
    popup.classList.add('visible');
    
    // ESC tuşu ile kapatma
    const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
            closePopularAppsPopup();
            document.removeEventListener('keydown', handleKeyDown);
        }
    };
    document.addEventListener('keydown', handleKeyDown);
    
    // Backdrop click ile kapatma
    popup.addEventListener('click', function(e) {
        if (e.target === popup) {
            closePopularAppsPopup();
        }
    });
    
    // Analytics track
    if (typeof window.va !== 'undefined') {
        window.va('track', 'popular_apps_viewed', {
            session: sessionId,
            timestamp: Date.now(),
            popular_count: getPopularApps().length
        });
    }
    
    console.log('✅ Popüler uygulamalar popup açıldı');
}

// Popüler uygulamalar popup'ını kapat - Geliştirilmiş versiyon
function closePopularAppsPopup() {
    const popup = document.getElementById('popular-apps-popup');
    if (popup) {
        popup.classList.remove('visible');
        popup.classList.add('hidden');
        
        // Animation tamamlandıktan sonra elementi kaldır
        setTimeout(() => {
            if (popup.parentNode) {
                popup.parentNode.removeChild(popup);
            }
        }, 400);
        
        console.log('🔥 Popüler uygulamalar popup kapatıldı');
    }
}

// Debug fonksiyonları
window.debugPopularButton = function() {
    const button = document.getElementById('popular-apps-btn');
    console.log('🔍 Debug Popüler Buton:', {
        element: button,
        className: button?.className,
        style: button?.style.cssText,
        events: {
            click: button?.onclick,
            listeners: 'check console'
        },
        position: button?.getBoundingClientRect(),
        visible: button ? window.getComputedStyle(button).display !== 'none' : false
    });
    
    if (button) {
        console.log('📊 Buton test tıklama...');
        button.click();
    }
};

// Manual initialization için
window.manualInitPopularButton = function() {
    console.log('🔧 Manual popüler buton başlatma...');
    const existingButton = document.getElementById('popular-apps-btn');
    if (existingButton) {
        existingButton.remove();
    }
    buttonAddAttempts = 0;
    addPopularButton();
};
        
        const popularBtn = document.createElement('div');
        popularBtn.className = 'stat-item popular-btn';
        popularBtn.id = 'popular-apps-btn';
        popularBtn.title = 'En Popüler Uygulamalar - Tıklayın!';
        popularBtn.style.cursor = 'pointer';
        
        // İlk olarak mevcut verileri kontrol et
        const popularApps = getPopularApps();
        const buttonText = popularApps.length > 0 ? popularApps.length.toString() : 'TOP';
        
        popularBtn.innerHTML = `
            <span class="stat-icon">🔥</span>
            <span class="stat-number">${buttonText}</span>
        `;
        
        popularBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('🔥 Popüler buton tıklandı!');
            showPopularAppsPopup();
        });
        
        // Hover efektleri
        popularBtn.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-4px) scale(1.05)';
            this.style.borderColor = 'var(--accent-primary)';
            this.style.boxShadow = '0 12px 32px rgba(139, 92, 246, 0.3)';
            this.style.background = 'rgba(139, 92, 246, 0.1)';
        });
        
        popularBtn.addEventListener('mouseleave', function() {
            this.style.transform = '';
            this.style.borderColor = '';
            this.style.boxShadow = '';
            this.style.background = '';
        });
        
        // İstatistiklerin sonuna ekle
        stats.appendChild(popularBtn);
        
        console.log('✅ Popüler uygulamalar butonu eklendi');
        
        // Analytics track
        if (typeof window.va !== 'undefined') {
            window.va('track', 'popular_button_added', {
                session: sessionId,
                timestamp: Date.now()
            });
        }
    }
    
    // CSS stillerini ekle (daha az süslü, daha fonksiyonel)
    function addPopularAppsStyles() {
        const existingStyle = document.getElementById('popular-apps-styles');
        if (existingStyle) return;
        
        const style = document.createElement('style');
        style.id = 'popular-apps-styles';
        style.textContent = `
            /* Popüler uygulamalar popup */
            .popular-apps-header {
                text-align: center;
                margin-bottom: 24px;
                padding-bottom: 16px;
                border-bottom: 1px solid var(--border-muted);
            }
            
            .popular-apps-header p {
                color: var(--text-secondary);
                margin-bottom: 12px;
            }
            
            .popular-apps-legend {
                display: flex;
                gap: 16px;
                justify-content: center;
                flex-wrap: wrap;
            }
            
            .legend-item {
                font-size: 0.8rem;
                color: var(--text-muted);
                display: flex;
                align-items: center;
                gap: 4px;
            }
            
            .popular-apps-list {
                display: flex;
                flex-direction: column;
                gap: 16px;
                max-height: 60vh;
                overflow-y: auto;
            }
            
            .popular-app-item {
                background: var(--bg-tertiary);
                border: 1px solid var(--border-muted);
                border-radius: 16px;
                padding: 16px;
                transition: all 0.3s ease;
                position: relative;
            }
            
            .popular-app-item:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 24px rgba(139, 92, 246, 0.2);
                border-color: rgba(139, 92, 246, 0.3);
            }
            
            .popular-app-rank {
                position: absolute;
                top: -8px;
                left: -8px;
                width: 32px;
                height: 32px;
                background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: 700;
                font-size: 0.9rem;
                color: white;
                box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
            }
            
            .popular-app-header {
                display: flex;
                align-items: center;
                margin-bottom: 12px;
            }
            
            .popular-app-header img,
            .popular-app-header .card-icon {
                width: 48px;
                height: 48px;
                border-radius: 12px;
                margin-right: 12px;
                flex-shrink: 0;
            }
            
            .popular-app-info {
                flex: 1;
            }
            
            .popular-app-info .app-name {
                font-weight: 600;
                font-size: 1.1rem;
                margin-bottom: 4px;
                color: var(--text-primary);
            }
            
            .popular-app-info .app-category {
                font-size: 0.75rem;
                color: var(--text-muted);
                background: rgba(139, 92, 246, 0.1);
                border: 1px solid rgba(139, 92, 246, 0.2);
                border-radius: 8px;
                padding: 2px 6px;
                display: inline-block;
                margin-bottom: 4px;
            }
            
            .popular-app-stats {
                display: flex;
                gap: 12px;
                margin-bottom: 12px;
                padding: 8px;
                background: rgba(0, 0, 0, 0.1);
                border-radius: 8px;
                flex-wrap: wrap;
            }
            
            .popular-app-stats .stat-item {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 2px;
                flex: 1;
                min-width: 60px;
            }
            
            .popular-app-stats .stat-item.score {
                background: rgba(139, 92, 246, 0.1);
                border-radius: 6px;
                padding: 4px;
                border: 1px solid rgba(139, 92, 246, 0.2);
            }
            
            .popular-app-stats .stat-value {
                font-weight: 700;
                font-size: 1.1rem;
                color: var(--accent-primary);
            }
            
            .popular-app-stats .stat-label {
                font-size: 0.7rem;
                color: var(--text-muted);
                text-align: center;
            }
            
            .popular-app-actions {
                display: flex;
                gap: 8px;
                justify-content: flex-end;
            }
            
            .no-popular-apps {
                text-align: center;
                padding: 60px 20px;
                color: var(--text-secondary);
            }
            
            .no-popular-apps .no-results-icon {
                font-size: 3rem;
                margin-bottom: 16px;
                opacity: 0.5;
            }
            
            .no-popular-apps h3 {
                font-size: 1.25rem;
                margin-bottom: 8px;
                color: var(--text-muted);
            }
            
            .no-popular-apps p {
                font-size: 0.9rem;
                opacity: 0.8;
                margin-bottom: 8px;
            }
            
            /* Responsive */
            @media (max-width: 768px) {
                .popular-apps-legend {
                    gap: 8px;
                }
                
                .legend-item {
                    font-size: 0.75rem;
                }
                
                .popular-app-stats {
                    gap: 8px;
                }
                
                .popular-app-stats .stat-item {
                    min-width: 50px;
                }
                
                .popular-app-header img,
                .popular-app-header .card-icon {
                    width: 40px;
                    height: 40px;
                }
                
                .popular-app-rank {
                    width: 28px;
                    height: 28px;
                    font-size: 0.8rem;
                }
            }
        `;
        
        document.head.appendChild(style);
    }
    
    // Sayfa kapanırken analytics gönder
    function trackPageUnload() {
        const sessionDuration = Date.now() - pageLoadTime;
        
        if (typeof window.va !== 'undefined') {
            window.va('track', 'page_unload', {
                session: sessionId,
                duration: sessionDuration,
                timestamp: Date.now()
            });
        }
    }
    
    // Initialization - Daha agresif
    function init() {
        console.log('📊 Analytics System başlatılıyor...');
        
        initSession();
        initVercelAnalytics();
        addPopularAppsStyles();
        
        // Buton eklemeyi hemen dene
        setTimeout(addPopularButton, 100);
        
        // Sayfa kapanma event'i
        window.addEventListener('beforeunload', trackPageUnload);
        
        console.log('✅ Analytics System hazır!');
        
        // Test için birkaç örnek veri oluştur (development mode)
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            setTimeout(() => {
                console.log('🧪 Test verisi oluşturuluyor...');
                trackAppView('Discord', 'view');
                trackAppView('Visual Studio Code', 'install');
                trackAppView('Spotify', 'about');
                trackAppView('Steam', 'view');
                trackAppView('Discord', 'about');
                console.log('🧪 Test verisi oluşturuldu');
            }, 2000);
        }
    }
    
    // Global olarak expose et
    const publicAPI = {
        init,
        trackAppView,
        showPopularAppsPopup,
        closePopularAppsPopup,
        trackAndShowApp,
        getPopularApps,
        calculatePopularApps,
        updatePopularButton,
        addPopularButton
    };
    
    // Global namespace'e koy
    window.AnalyticsSystem = publicAPI;
    
    return publicAPI;
})();

// Auto-initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => {
            window.AnalyticsSystem.init();
        }, 100);
    });
} else {
    setTimeout(() => {
        window.AnalyticsSystem.init();
    }, 100);
}

console.log('📊 Analytics System modülü yüklendi');
