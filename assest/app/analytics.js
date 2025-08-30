// assest/app/analytics.js - İstemci tarafı analytics sistemi (FIXED)
// Vercel KV ile entegre analytics modülü - Hata düzeltmeleri ile

(function() {
    'use strict';

    // ============ CONFIGURATION ============
    const CONFIG = {
        API_BASE: '/api/analytics',
        STORAGE_KEY: 'linux_app_hub_analytics',
        BATCH_SIZE: 10,
        BATCH_TIMEOUT: 5000, // 5 saniye
        RETRY_ATTEMPTS: 3,
        RETRY_DELAY: 1000,
        POPULAR_CACHE_TTL: 5 * 60 * 1000, // 5 dakika
        DEBUG: false,
        OFFLINE_MODE: false, // Offline mode for development
        MOCK_DATA_ENABLED: true // Mock data for testing
    };

    // ============ ANALYTICS SYSTEM ============
    class AnalyticsSystem {
        constructor() {
            this.isInitialized = false;
            this.eventQueue = [];
            this.batchTimer = null;
            this.popularAppsCache = [];
            this.popularAppsCacheTime = 0;
            this.sessionId = this.generateSessionId();
            this.retryQueue = [];
            this.isOnline = navigator.onLine;
            this.mockData = this.initMockData();
            
            this.init();
        }

        // ============ INITIALIZATION ============
        init() {
            if (this.isInitialized) return;
            
            this.log('🚀 Analytics System başlatılıyor...');
            
            // Detect if API is available
            this.detectAPIAvailability();
            
            // Event listeners
            this.setupEventListeners();
            
            // Periodic tasks
            this.setupPeriodicTasks();
            
            // Page unload handler
            this.setupUnloadHandler();
            
            // Initialize with mock data if needed
            if (CONFIG.MOCK_DATA_ENABLED) {
                this.initializeWithMockData();
            }
            
            this.isInitialized = true;
            this.log('✅ Analytics System hazır');
        }

        async detectAPIAvailability() {
            try {
                const response = await fetch(`${CONFIG.API_BASE}?action=health`, {
                    method: 'GET',
                    timeout: 3000
                });
                
                if (response.ok) {
                    this.log('✅ API endpoint erişilebilir');
                    CONFIG.OFFLINE_MODE = false;
                } else {
                    throw new Error('API not available');
                }
            } catch (error) {
                this.log('⚠️ API erişilemez, offline moda geçiliyor');
                CONFIG.OFFLINE_MODE = true;
            }
        }

        initMockData() {
            // Development için mock data
            return [
                { name: 'Discord', stats: { views: 150, installs: 45, about: 20 } },
                { name: 'Visual Studio Code', stats: { views: 134, installs: 67, about: 15 } },
                { name: 'Spotify', stats: { views: 98, installs: 23, about: 12 } },
                { name: 'Google Chrome', stats: { views: 87, installs: 31, about: 8 } },
                { name: 'Steam', stats: { views: 76, installs: 19, about: 6 } },
                { name: 'OBS Studio', stats: { views: 65, installs: 28, about: 7 } },
                { name: 'GIMP', stats: { views: 54, installs: 15, about: 9 } },
                { name: 'VLC', stats: { views: 43, installs: 12, about: 4 } }
            ];
        }

        initializeWithMockData() {
            if (CONFIG.OFFLINE_MODE || window.location.hostname === 'localhost') {
                this.popularAppsCache = this.mockData;
                this.popularAppsCacheTime = Date.now();
                this.log('🧪 Mock data ile başlatıldı');
            }
        }

        generateSessionId() {
            return Date.now().toString(36) + Math.random().toString(36).substr(2);
        }

        log(message, data = null) {
            if (CONFIG.DEBUG) {
                console.log(`📊 [Analytics] ${message}`, data || '');
            }
        }

        error(message, error = null) {
            console.error(`❌ [Analytics] ${message}`, error || '');
        }

        // ============ EVENT TRACKING ============
        trackAppView(appName, actionType = 'view', metadata = {}) {
            if (!appName || !actionType) {
                this.error('trackAppView: appName ve actionType gerekli');
                return false;
            }

            const event = {
                appName: appName.trim(),
                actionType: actionType.toLowerCase(),
                timestamp: Date.now(),
                sessionId: this.sessionId,
                metadata: {
                    userAgent: navigator.userAgent,
                    language: navigator.language,
                    screen: `${screen.width}x${screen.height}`,
                    url: window.location.href,
                    referrer: document.referrer,
                    ...metadata
                }
            };

            this.log(`📈 Tracking: ${appName} - ${actionType}`);
            
            // Update mock data if in offline mode
            if (CONFIG.OFFLINE_MODE || CONFIG.MOCK_DATA_ENABLED) {
                this.updateMockData(appName, actionType);
            }
            
            this.queueEvent(event);
            return true;
        }

        updateMockData(appName, actionType) {
            let app = this.mockData.find(a => a.name === appName);
            if (!app) {
                app = { 
                    name: appName, 
                    stats: { views: 0, installs: 0, about: 0 } 
                };
                this.mockData.push(app);
            }
            
            switch(actionType) {
                case 'view':
                    app.stats.views++;
                    break;
                case 'install':
                case 'install_popup_opened':
                    app.stats.installs++;
                    break;
                case 'about':
                case 'about_popup_opened':
                    app.stats.about++;
                    break;
            }
            
            // Re-sort and update cache
            this.mockData.sort((a, b) => {
                const aTotal = a.stats.views + a.stats.installs * 2 + a.stats.about;
                const bTotal = b.stats.views + b.stats.installs * 2 + b.stats.about;
                return bTotal - aTotal;
            });
            
            this.popularAppsCache = this.mockData;
            this.popularAppsCacheTime = Date.now();
        }

        queueEvent(event) {
            this.eventQueue.push(event);
            
            // Batch size'a ulaştıysak hemen gönder
            if (this.eventQueue.length >= CONFIG.BATCH_SIZE) {
                this.sendBatch();
            } else {
                // Yoksa timer başlat
                this.startBatchTimer();
            }
        }

        startBatchTimer() {
            if (this.batchTimer) return;
            
            this.batchTimer = setTimeout(() => {
                this.sendBatch();
            }, CONFIG.BATCH_TIMEOUT);
        }

        clearBatchTimer() {
            if (this.batchTimer) {
                clearTimeout(this.batchTimer);
                this.batchTimer = null;
            }
        }

        // ============ BATCH PROCESSING ============
        async sendBatch() {
            this.clearBatchTimer();
            
            if (this.eventQueue.length === 0) return;

            const events = [...this.eventQueue];
            this.eventQueue = [];

            this.log(`📤 Batch gönderiliyor: ${events.length} event`);

            // If offline mode, just simulate success
            if (CONFIG.OFFLINE_MODE) {
                this.log(`📡 Offline mode - events simulated: ${events.length}`);
                return;
            }

            try {
                // Her event'i ayrı ayrı gönder (API design'ına uygun)
                const promises = events.map(event => this.sendEvent(event));
                const results = await Promise.allSettled(promises);
                
                // Failed events'i retry queue'ya ekle
                const failedEvents = [];
                results.forEach((result, index) => {
                    if (result.status === 'rejected') {
                        failedEvents.push(events[index]);
                    }
                });

                if (failedEvents.length > 0) {
                    this.log(`⚠️ ${failedEvents.length} event başarısız, retry queue'ya ekleniyor`);
                    this.retryQueue.push(...failedEvents);
                }

                this.log(`✅ Batch işlendi: ${events.length - failedEvents.length} başarılı, ${failedEvents.length} başarısız`);

            } catch (error) {
                this.error('Batch gönderme hatası:', error);
                // Tüm events'i retry queue'ya ekle
                this.retryQueue.push(...events);
            }
        }

        async sendEvent(event, retryAttempt = 0) {
            // Skip actual sending in offline mode
            if (CONFIG.OFFLINE_MODE) {
                return { success: true, simulated: true };
            }

            try {
                const response = await fetch(`${CONFIG.API_BASE}?action=track`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        appName: event.appName,
                        actionType: event.actionType,
                        timestamp: event.timestamp,
                        sessionId: event.sessionId,
                        metadata: event.metadata
                    })
                });

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }

                const result = await response.json();
                
                if (!result.success) {
                    throw new Error(result.error || 'API returned success: false');
                }

                this.log(`✅ Event gönderildi: ${event.appName} - ${event.actionType}`);
                return result;

            } catch (error) {
                this.error(`Event gönderme hatası (attempt ${retryAttempt + 1}):`, error);
                
                // Retry logic
                if (retryAttempt < CONFIG.RETRY_ATTEMPTS) {
                    await new Promise(resolve => setTimeout(resolve, CONFIG.RETRY_DELAY * (retryAttempt + 1)));
                    return this.sendEvent(event, retryAttempt + 1);
                }
                
                throw error;
            }
        }

        // ============ POPULAR APPS ============ (FIXED)
        async getPopularApps(limit = 10, timeframe = '7d', useCache = true) {
            // Cache kontrolü
            if (useCache && Array.isArray(this.popularAppsCache) && this.popularAppsCache.length > 0 && 
                (Date.now() - this.popularAppsCacheTime) < CONFIG.POPULAR_CACHE_TTL) {
                this.log('📦 Popular apps cache\'ten döndürülüyor');
                return this.popularAppsCache.slice(0, limit); // FIXED: Always return array
            }

            // If offline mode, return mock data
            if (CONFIG.OFFLINE_MODE || CONFIG.MOCK_DATA_ENABLED) {
                this.log('🧪 Mock data döndürülüyor');
                const mockResult = this.mockData.slice(0, limit);
                this.popularAppsCache = mockResult;
                this.popularAppsCacheTime = Date.now();
                return mockResult;
            }

            try {
                this.log(`🔥 Popular apps getiriliyor: limit=${limit}, timeframe=${timeframe}`);
                
                const response = await fetch(
                    `${CONFIG.API_BASE}?action=popular&limit=${limit}&timeframe=${timeframe}`
                );

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }

                const result = await response.json();

                if (!result.success) {
                    throw new Error(result.error || 'API returned success: false');
                }

                // FIXED: Always ensure we have an array
                let popularApps = result.popular_apps || [];
                if (!Array.isArray(popularApps)) {
                    this.error('API returned non-array popular_apps, converting to array');
                    popularApps = [];
                }

                // Cache'e kaydet
                this.popularAppsCache = popularApps;
                this.popularAppsCacheTime = Date.now();

                this.log(`✅ ${popularApps.length} popular app getirildi`);
                
                // Event dispatch et
                window.dispatchEvent(new CustomEvent('popularAppsUpdated', {
                    detail: { 
                        popularApps: popularApps,
                        timeframe: timeframe 
                    }
                }));

                return popularApps;

            } catch (error) {
                this.error('Popular apps getirme hatası:', error);
                
                // FIXED: Always return array, use cache or mock data as fallback
                let fallback = [];
                if (Array.isArray(this.popularAppsCache) && this.popularAppsCache.length > 0) {
                    fallback = this.popularAppsCache;
                } else if (CONFIG.MOCK_DATA_ENABLED) {
                    fallback = this.mockData.slice(0, limit);
                }
                
                return fallback;
            }
        }

        async getStats() {
            if (CONFIG.OFFLINE_MODE) {
                return {
                    total_events: 1234,
                    unique_apps: 42,
                    total_views: 5678
                };
            }

            try {
                this.log('📊 Stats getiriliyor...');
                
                const response = await fetch(`${CONFIG.API_BASE}?action=stats`);

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }

                const result = await response.json();

                if (!result.success) {
                    throw new Error(result.error || 'API returned success: false');
                }

                this.log('✅ Stats getirildi:', result.stats);
                return result.stats;

            } catch (error) {
                this.error('Stats getirme hatası:', error);
                return null;
            }
        }

        // ============ POPULAR APPS UI ============ (FIXED)
        async calculatePopularApps() {
            this.log('🔥 Popular apps hesaplanıyor...');
            
            try {
                const popularApps = await this.getPopularApps(8, '7d');
                
                // FIXED: Check if popularApps is array and has length
                if (Array.isArray(popularApps) && popularApps.length > 0) {
                    this.showPopularAppsPopup(popularApps);
                } else {
                    this.log('⚠️ Henüz popular app verisi yok');
                    
                    // If no data, show a message or generate test data
                    if (CONFIG.MOCK_DATA_ENABLED && window.location.hostname === 'localhost') {
                        this.log('🧪 Test verisi oluşturuluyor...');
                        this.generateTestData();
                        setTimeout(() => this.calculatePopularApps(), 1000);
                    }
                }
                
            } catch (error) {
                this.error('Popular apps hesaplama hatası:', error);
            }
        }

        generateTestData() {
            const testApps = ['Discord', 'Visual Studio Code', 'Spotify', 'Steam', 'GIMP'];
            testApps.forEach((appName, index) => {
                setTimeout(() => {
                    this.trackAppView(appName, 'view');
                    if (index % 2 === 0) this.trackAppView(appName, 'install');
                    if (index % 3 === 0) this.trackAppView(appName, 'about');
                }, index * 100);
            });
            this.log('🧪 Test verisi oluşturuldu');
        }

showPopularAppsPopup(popularApps) {
    // FIXED: Ensure popularApps is array
    if (!Array.isArray(popularApps) || popularApps.length === 0) {
        this.log('⚠️ Popular apps popup için geçerli veri yok');
        return;
    }
    if (!Array.isArray(popularApps)) {
        console.error('popularApps is not an array:', popularApps);
        return;
    }

    // İlk 10 uygulamayı al
    const topApps = popularApps.slice(0, 10);

    // Mevcut popup'ı kaldır
    this.closePopularAppsPopup();

    const popup = document.createElement('div');
    popup.id = 'popular-apps-popup';
    popup.className = 'popular-apps-popup';
    popup.innerHTML = `
        <div class="popular-apps-content">
            <div class="popular-apps-header">
                <h3>🔥 Bu Hafta Popüler</h3>
                <button class="close-btn" onclick="window.AnalyticsSystem.closePopularAppsPopup()">&times;</button>
            </div>
            <div class="popular-apps-list">
                ${topApps.map((app, index) => `
                    <div class="popular-app-item" data-app="${app.name}">
                        <span class="rank">#${index + 1}</span>
                        <span class="app-name">${app.name}</span>
                        <div class="app-stats">
                            <span class="views" title="Görüntüleme">👁️ ${app.stats?.views || 0}</span>
                            ${(app.stats?.installs || 0) > 0 ? `<span class="installs" title="Kurulum">📦 ${app.stats.installs}</span>` : ''}
                        </div>
                    </div>
                `).join('')}
            </div>
            <div class="popular-apps-footer">
                <small>Son 7 günün verileri • ${new Date().toLocaleDateString('tr-TR')}</small>
            </div>
        </div>
    `;

            // CSS stilleri
            const style = document.createElement('style');
            style.textContent = `
                .popular-apps-popup {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    z-index: 10000;
                    background: var(--bg-secondary);
                    border: 2px solid var(--accent-primary);
                    border-radius: 16px;
                    padding: 0;
                    box-shadow: 0 20px 40px rgba(139, 92, 246, 0.3);
                    backdrop-filter: blur(20px);
                    max-width: 320px;
                    animation: slideInUp 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                }
                
                @keyframes slideInUp {
                    from {
                        transform: translateY(100px) scale(0.9);
                        opacity: 0;
                    }
                    to {
                        transform: translateY(0) scale(1);
                        opacity: 1;
                    }
                }
                
                .popular-apps-content {
                    padding: 16px;
                }
                
                .popular-apps-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 12px;
                }
                
                .popular-apps-header h3 {
                    margin: 0;
                    color: var(--accent-primary);
                    font-size: 16px;
                    font-weight: 600;
                }
                
                .close-btn {
                    background: none;
                    border: none;
                    color: var(--text-secondary);
                    font-size: 20px;
                    cursor: pointer;
                    padding: 0;
                    width: 24px;
                    height: 24px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s;
                }
                
                .close-btn:hover {
                    background: var(--bg-tertiary);
                    color: var(--text-primary);
                }
                
                .popular-app-item {
                    display: flex;
                    align-items: center;
                    padding: 8px 0;
                    border-bottom: 1px solid var(--border-color);
                    cursor: pointer;
                    transition: all 0.2s;
                }
                
                .popular-app-item:last-child {
                    border-bottom: none;
                }
                
                .popular-app-item:hover {
                    background: var(--bg-tertiary);
                    border-radius: 8px;
                    padding-left: 8px;
                    padding-right: 8px;
                }
                
                .rank {
                    font-weight: 600;
                    color: var(--accent-primary);
                    margin-right: 12px;
                    min-width: 24px;
                }
                
                .app-name {
                    flex: 1;
                    font-weight: 500;
                    color: var(--text-primary);
                }
                
                .app-stats {
                    display: flex;
                    gap: 8px;
                    font-size: 12px;
                    color: var(--text-secondary);
                }
                
                .popular-apps-footer {
                    margin-top: 12px;
                    padding-top: 12px;
                    border-top: 1px solid var(--border-color);
                    text-align: center;
                    color: var(--text-secondary);
                }
                
                .popular-apps-footer small {
                    font-size: 11px;
                }
                
                @media (max-width: 768px) {
                    .popular-apps-popup {
                        bottom: 10px;
                        right: 10px;
                        left: 10px;
                        max-width: none;
                    }
                }
            `;

            document.head.appendChild(style);
            document.body.appendChild(popup);

            // Click handlers
            popup.querySelectorAll('.popular-app-item').forEach(item => {
                item.addEventListener('click', () => {
                    const appName = item.dataset.app;
                    this.trackAppView(appName, 'popular_click');
                    
                    // Uygulamayı bul ve popup göster
                    if (typeof window.apps !== 'undefined') {
                        const app = window.apps.find(a => a.name === appName);
                        if (app && typeof window.showAppPopup === 'function') {
                            window.showAppPopup(app, 'auto');
                            this.closePopularAppsPopup();
                        }
                    }
                });
            });

            // Auto-close after 10 seconds
            setTimeout(() => {
                this.closePopularAppsPopup();
            }, 10000);

            this.log('🔥 Popular apps popup gösterildi');
        }

        closePopularAppsPopup() {
            const popup = document.getElementById('popular-apps-popup');
            if (popup) {
                popup.remove();
                this.log('🔥 Popular apps popup kapatıldı');
            }
        }

        // ============ RETRY MECHANISM ============
        async processRetryQueue() {
            if (this.retryQueue.length === 0) return;

            this.log(`🔄 Retry queue işleniyor: ${this.retryQueue.length} event`);

            const events = [...this.retryQueue];
            this.retryQueue = [];

            try {
                const promises = events.map(event => this.sendEvent(event));
                const results = await Promise.allSettled(promises);

                let retryCount = 0;
                results.forEach((result, index) => {
                    if (result.status === 'rejected') {
                        // Son deneme bile başarısız olduysa, veriyi kaybet
                        this.error(`Event kalıcı olarak başarısız: ${events[index].appName}`, result.reason);
                        retryCount++;
                    }
                });

                this.log(`🔄 Retry işlemi tamamlandı: ${events.length - retryCount} başarılı, ${retryCount} kayıp`);

            } catch (error) {
                this.error('Retry queue işleme hatası:', error);
            }
        }

        // ============ EVENT LISTENERS ============
        setupEventListeners() {
            // Sayfa görünürlük değişikliği
            document.addEventListener('visibilitychange', () => {
                if (document.hidden) {
                    // Sayfa gizlendiğinde kuyruktaki eventleri gönder
                    this.sendBatch();
                } else {
                    // Sayfa tekrar görünür olduğunda popular apps'ı güncelle
                    setTimeout(() => {
                        this.getPopularApps(8, '7d', false); // Cache'siz güncelle
                    }, 2000);
                }
            });

            // Online/Offline durumu
            window.addEventListener('online', () => {
                this.isOnline = true;
                this.log('🌐 Bağlantı geri geldi, retry queue işleniyor');
                CONFIG.OFFLINE_MODE = false;
                this.processRetryQueue();
            });

            window.addEventListener('offline', () => {
                this.isOnline = false;
                this.log('📡 Bağlantı kesildi');
                CONFIG.OFFLINE_MODE = true;
            });
        }

        setupPeriodicTasks() {
            // Retry queue'yu periyodik olarak işle
            setInterval(() => {
                if (this.isOnline && !CONFIG.OFFLINE_MODE) {
                    this.processRetryQueue();
                }
            }, 60000); // 1 dakikada bir

            // Popular apps'ı periyodik güncelle
            setInterval(() => {
                this.getPopularApps(8, '7d', false);
            }, CONFIG.POPULAR_CACHE_TTL);
        }

        setupUnloadHandler() {
            // Sayfa kapanırken son batch'i gönder
            window.addEventListener('beforeunload', () => {
                if (this.eventQueue.length > 0) {
                    // sendBeacon API'si ile güvenilir gönderim
                    this.sendBeaconBatch();
                }
            });

            // pagehide event'i (mobil için daha güvenilir)
            window.addEventListener('pagehide', () => {
                if (this.eventQueue.length > 0) {
                    this.sendBeaconBatch();
                }
            });
        }

        sendBeaconBatch() {
            if (!navigator.sendBeacon || this.eventQueue.length === 0 || CONFIG.OFFLINE_MODE) return;

            const events = [...this.eventQueue];
            this.eventQueue = [];

            // Her event'i ayrı beacon ile gönder
            events.forEach(event => {
                const data = JSON.stringify({
                    appName: event.appName,
                    actionType: event.actionType,
                    timestamp: event.timestamp,
                    sessionId: event.sessionId
                });

                try {
                    navigator.sendBeacon(`${CONFIG.API_BASE}?action=track`, data);
                } catch (error) {
                    this.error('Beacon gönderme hatası:', error);
                }
            });

            this.log(`📡 ${events.length} event beacon ile gönderildi`);
        }

        // ============ PUBLIC API ============
        // Harici kullanım için public metodlar
        track(appName, actionType, metadata) {
            return this.trackAppView(appName, actionType, metadata);
        }

        getPopular(limit, timeframe) {
            return this.getPopularApps(limit, timeframe);
        }

        showPopular() {
            return this.calculatePopularApps();
        }

        clearCache() {
            this.popularAppsCache = [];
            this.popularAppsCacheTime = 0;
            this.log('🗑️ Cache temizlendi');
        }

        getQueueStatus() {
            return {
                eventQueue: this.eventQueue.length,
                retryQueue: this.retryQueue.length,
                isInitialized: this.isInitialized,
                sessionId: this.sessionId,
                isOnline: this.isOnline,
                offlineMode: CONFIG.OFFLINE_MODE,
                mockDataEnabled: CONFIG.MOCK_DATA_ENABLED
            };
        }

        // Debug için
        enableDebug() {
            CONFIG.DEBUG = true;
            this.log('🐛 Debug modu etkinleştirildi');
        }

        disableDebug() {
            CONFIG.DEBUG = false;
            console.log('📊 [Analytics] Debug modu devre dışı bırakıldı');
        }

        // FIXED: Force offline mode for testing
        enableOfflineMode() {
            CONFIG.OFFLINE_MODE = true;
            this.log('📡 Offline mode etkinleştirildi');
        }

        disableOfflineMode() {
            CONFIG.OFFLINE_MODE = false;
            this.log('🌐 Online mode etkinleştirildi');
        }
    }

    // ============ GLOBAL SETUP ============
    // Analytics sistemini global yap
    window.AnalyticsSystem = new AnalyticsSystem();
    
    // Development mode için debug etkinleştir
    if (window.location.hostname === 'localhost' || 
        window.location.hostname === '127.0.0.1' || 
        window.location.hostname.includes('192.168.')) {
        window.AnalyticsSystem.enableDebug();
        CONFIG.MOCK_DATA_ENABLED = true;
    }

    // jQuery-style ready function için
    window.AnalyticsSystem.ready = function(callback) {
        if (this.isInitialized) {
            callback();
        } else {
            setTimeout(() => callback(), 100);
        }
    };

    // Console helpers for debugging
    window.analyticsDebug = {
        status: () => window.AnalyticsSystem.getQueueStatus(),
        popular: () => window.AnalyticsSystem.getPopularApps(),
        showPopular: () => window.AnalyticsSystem.calculatePopularApps(),
        track: (app, action) => window.AnalyticsSystem.trackAppView(app, action),
        enableOffline: () => window.AnalyticsSystem.enableOfflineMode(),
        disableOffline: () => window.AnalyticsSystem.disableOfflineMode(),
        generateTest: () => window.AnalyticsSystem.generateTestData()
    };

    console.log('📊 Analytics System yüklendi ve hazır');
    console.log('🧪 Debug için: window.analyticsDebug kullanın');

})();
