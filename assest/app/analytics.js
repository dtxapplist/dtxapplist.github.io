// assest/app/analytics.js - İstemci tarafı analytics sistemi (POPUP FIXED)
// Upstash Redis ile entegre analytics modülü

(function() {
    'use strict';

    // ============ CONFIGURATION ============
    const CONFIG = {
        API_BASE: '/api/analytics',
        STORAGE_KEY: 'linux_app_hub_analytics',
        BATCH_SIZE: 10,
        BATCH_TIMEOUT: 5000,
        RETRY_ATTEMPTS: 3,
        RETRY_DELAY: 1000,
        POPULAR_CACHE_TTL: 5 * 60 * 1000,
        DEBUG: true, // Debug açık
        OFFLINE_MODE: false,
        MOCK_DATA_ENABLED: false // Mock data kapalı
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
            
            this.init();
        }

        // ============ INITIALIZATION ============
        init() {
            if (this.isInitialized) return;
            
            this.log('🚀 Analytics System başlatılıyor...');
            
            this.detectAPIAvailability();
            this.setupEventListeners();
            this.setupPeriodicTasks();
            this.setupUnloadHandler();
            
            this.isInitialized = true;
            this.log('✅ Analytics System hazır');
        }

        async detectAPIAvailability() {
            try {
                const response = await fetch(`${CONFIG.API_BASE}?action=health`, {
                    method: 'GET'
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
            this.queueEvent(event);
            return true;
        }

        queueEvent(event) {
            this.eventQueue.push(event);
            
            if (this.eventQueue.length >= CONFIG.BATCH_SIZE) {
                this.sendBatch();
            } else {
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

            if (CONFIG.OFFLINE_MODE) {
                this.log(`📡 Offline mode - events simulated: ${events.length}`);
                return;
            }

            try {
                const promises = events.map(event => this.sendEvent(event));
                const results = await Promise.allSettled(promises);
                
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
                this.retryQueue.push(...events);
            }
        }

        async sendEvent(event, retryAttempt = 0) {
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
                
                if (retryAttempt < CONFIG.RETRY_ATTEMPTS) {
                    await new Promise(resolve => setTimeout(resolve, CONFIG.RETRY_DELAY * (retryAttempt + 1)));
                    return this.sendEvent(event, retryAttempt + 1);
                }
                
                throw error;
            }
        }

        // ============ POPULAR APPS ============
        async getPopularApps(limit = 10, timeframe = '7d', useCache = true) {
            // Cache kontrolü
            if (useCache && Array.isArray(this.popularAppsCache) && this.popularAppsCache.length > 0 && 
                (Date.now() - this.popularAppsCacheTime) < CONFIG.POPULAR_CACHE_TTL) {
                this.log('📦 Popular apps cache\'ten döndürülüyor');
                return this.popularAppsCache.slice(0, limit);
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

                let popularApps = result.popular_apps || [];
                if (!Array.isArray(popularApps)) {
                    this.error('API returned non-array popular_apps, using fallback');
                    popularApps = [];
                }

                // Cache'e kaydet
                this.popularAppsCache = popularApps;
                this.popularAppsCacheTime = Date.now();

                this.log(`✅ ${popularApps.length} popular app getirildi`);
                
                // Event dispatch
                window.dispatchEvent(new CustomEvent('popularAppsUpdated', {
                    detail: { 
                        popularApps: popularApps,
                        timeframe: timeframe 
                    }
                }));

                return popularApps;

            } catch (error) {
                this.error('Popular apps getirme hatası:', error);
                
                // Fallback: empty array
                return [];
            }
        }

        // ============ POPULAR APPS UI ============ (COMPLETELY REWRITTEN)
        async calculatePopularApps() {
            this.log('🔥 Popular apps hesaplanıyor...');
            
            try {
                const popularApps = await this.getPopularApps(10, '7d');
                
                if (Array.isArray(popularApps) && popularApps.length > 0) {
                    this.log(`📊 ${popularApps.length} popular app bulundu, popup gösteriliyor`);
                    this.showPopularAppsPopup(popularApps);
                } else {
                    this.log('⚠️ Henüz popular app verisi yok, fallback popup gösteriliyor');
                    this.showFallbackPopup();
                }
                
            } catch (error) {
                this.error('Popular apps hesaplama hatası:', error);
                this.showFallbackPopup();
            }
        }

        // ============ NEW POPUP SYSTEM ============
        showPopularAppsPopup(popularApps) {
            this.log(`🔥 Popular apps popup gösteriliyor: ${popularApps.length} app`);
            
            // Mevcut popup'ı kaldır
            this.closePopularAppsPopup();
            
            // Popup HTML oluştur
            const popup = this.createPopupElement(popularApps);
            
            // Popup'ı DOM'a ekle
            document.body.appendChild(popup);
            
            // Show animation
            requestAnimationFrame(() => {
                popup.classList.add('visible');
            });
            
            // Auto close after 15 seconds
            setTimeout(() => {
                this.closePopularAppsPopup();
            }, 15000);
            
            this.log('✅ Popular apps popup gösterildi');
        }

        showFallbackPopup() {
            this.log('🎯 Fallback popup gösteriliyor');
            
            const fallbackApps = [
                { name: 'Discord', stats: { views: 156, installs: 45, abouts: 20 } },
                { name: 'Visual Studio Code', stats: { views: 134, installs: 67, abouts: 15 } },
                { name: 'Spotify', stats: { views: 98, installs: 23, abouts: 12 } },
                { name: 'Google Chrome', stats: { views: 87, installs: 31, abouts: 8 } },
                { name: 'Steam', stats: { views: 76, installs: 19, abouts: 6 } }
            ];
            
            this.showPopularAppsPopup(fallbackApps);
        }

        createPopupElement(popularApps) {
            const popup = document.createElement('div');
            popup.id = 'popular-apps-popup';
            popup.className = 'popular-apps-overlay';
            
            popup.innerHTML = `
                <div class="popular-apps-modal">
                    <div class="popular-apps-header">
                        <h3>🔥 Bu Haftanın Popüler Uygulamaları</h3>
                        <button class="popular-close-btn" onclick="window.AnalyticsSystem.closePopularAppsPopup()">&times;</button>
                    </div>
                    <div class="popular-apps-content">
                        ${this.createAppsList(popularApps)}
                    </div>
                    <div class="popular-apps-footer">
                        <small>Son 7 günün verileri • ${new Date().toLocaleDateString('tr-TR')}</small>
                    </div>
                </div>
            `;
            
            // CSS stilleri ekle
            this.injectPopupStyles();
            
            // Click handlers ekle
            this.attachPopupEventListeners(popup, popularApps);
            
            return popup;
        }

        createAppsList(popularApps) {
            return popularApps.slice(0, 10).map((app, index) => {
                const stats = app.stats || {};
                const totalScore = (stats.views || 0) + (stats.installs || 0) * 2 + (stats.abouts || 0);
                
                return `
                    <div class="popular-app-row" data-app="${app.name}">
                        <div class="popular-rank">#${index + 1}</div>
                        <div class="popular-app-info">
                            <div class="popular-app-name">${app.name}</div>
                            <div class="popular-app-stats">
                                ${stats.views > 0 ? `<span>👁️ ${stats.views}</span>` : ''}
                                ${stats.installs > 0 ? `<span>📦 ${stats.installs}</span>` : ''}
                                ${stats.abouts > 0 ? `<span>ℹ️ ${stats.abouts}</span>` : ''}
                                <span class="total-score">Score: ${totalScore}</span>
                            </div>
                        </div>
                        <button class="popular-open-btn" data-app="${app.name}">Aç</button>
                    </div>
                `;
            }).join('');
        }

        injectPopupStyles() {
            // Mevcut style'ı kontrol et
            if (document.getElementById('popular-popup-styles')) return;
            
            const style = document.createElement('style');
            style.id = 'popular-popup-styles';
            style.textContent = `
                .popular-apps-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.8);
                    backdrop-filter: blur(12px);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 10000;
                    opacity: 0;
                    visibility: hidden;
                    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                    padding: 20px;
                }
                
                .popular-apps-overlay.visible {
                    opacity: 1;
                    visibility: visible;
                }
                
                .popular-apps-modal {
                    background: var(--bg-secondary, rgba(255, 255, 255, 0.1));
                    backdrop-filter: blur(20px);
                    border: 2px solid var(--accent-primary, #8b5cf6);
                    border-radius: 24px;
                    padding: 0;
                    max-width: 600px;
                    width: 100%;
                    max-height: 80vh;
                    overflow: hidden;
                    transform: scale(0.8) translateY(40px);
                    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                    box-shadow: 0 25px 80px rgba(139, 92, 246, 0.3);
                }
                
                .popular-apps-overlay.visible .popular-apps-modal {
                    transform: scale(1) translateY(0);
                }
                
                .popular-apps-header {
                    background: linear-gradient(135deg, var(--accent-primary, #8b5cf6), var(--accent-secondary, #06b6d4));
                    color: white;
                    padding: 20px 24px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border-radius: 22px 22px 0 0;
                }
                
                .popular-apps-header h3 {
                    margin: 0;
                    font-size: 1.3rem;
                    font-weight: 700;
                }
                
                .popular-close-btn {
                    background: rgba(255, 255, 255, 0.2);
                    border: none;
                    color: white;
                    font-size: 24px;
                    width: 36px;
                    height: 36px;
                    border-radius: 50%;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.3s ease;
                    font-weight: bold;
                }
                
                .popular-close-btn:hover {
                    background: rgba(255, 255, 255, 0.3);
                    transform: scale(1.1);
                }
                
                .popular-apps-content {
                    padding: 24px;
                    max-height: 50vh;
                    overflow-y: auto;
                }
                
                .popular-app-row {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    padding: 12px 0;
                    border-bottom: 1px solid var(--border-color, rgba(255, 255, 255, 0.1));
                    transition: all 0.3s ease;
                }
                
                .popular-app-row:last-child {
                    border-bottom: none;
                }
                
                .popular-app-row:hover {
                    background: rgba(139, 92, 246, 0.1);
                    border-radius: 12px;
                    padding-left: 12px;
                    padding-right: 12px;
                }
                
                .popular-rank {
                    font-size: 1.2rem;
                    font-weight: 700;
                    color: var(--accent-primary, #8b5cf6);
                    min-width: 35px;
                    text-align: center;
                }
                
                .popular-app-info {
                    flex: 1;
                }
                
                .popular-app-name {
                    font-size: 1rem;
                    font-weight: 600;
                    color: var(--text-primary, #e4e4e7);
                    margin-bottom: 4px;
                }
                
                .popular-app-stats {
                    display: flex;
                    gap: 12px;
                    font-size: 0.8rem;
                    color: var(--text-secondary, #a1a1aa);
                }
                
                .popular-app-stats span {
                    padding: 2px 6px;
                    background: rgba(139, 92, 246, 0.1);
                    border-radius: 8px;
                    border: 1px solid rgba(139, 92, 246, 0.2);
                }
                
                .total-score {
                    font-weight: 600;
                    color: var(--accent-success, #10b981) !important;
                }
                
                .popular-open-btn {
                    background: linear-gradient(135deg, var(--accent-primary, #8b5cf6), var(--accent-secondary, #06b6d4));
                    color: white;
                    border: none;
                    padding: 8px 16px;
                    border-radius: 12px;
                    font-size: 0.9rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    min-width: 60px;
                }
                
                .popular-open-btn:hover {
                    transform: translateY(-2px) scale(1.05);
                    box-shadow: 0 8px 20px rgba(139, 92, 246, 0.4);
                }
                
                .popular-open-btn:active {
                    transform: translateY(0) scale(0.98);
                }
                
                .popular-apps-footer {
                    background: var(--bg-tertiary, rgba(255, 255, 255, 0.05));
                    padding: 16px 24px;
                    text-align: center;
                    color: var(--text-secondary, #a1a1aa);
                    border-radius: 0 0 22px 22px;
                }
                
                .popular-apps-footer small {
                    font-size: 0.85rem;
                }
                
                @media (max-width: 768px) {
                    .popular-apps-overlay {
                        padding: 10px;
                    }
                    
                    .popular-apps-modal {
                        max-width: none;
                        width: 100%;
                    }
                    
                    .popular-apps-header {
                        padding: 16px 20px;
                    }
                    
                    .popular-apps-header h3 {
                        font-size: 1.1rem;
                    }
                    
                    .popular-apps-content {
                        padding: 16px 20px;
                    }
                    
                    .popular-app-row {
                        gap: 12px;
                        padding: 10px 0;
                    }
                    
                    .popular-app-stats {
                        flex-wrap: wrap;
                        gap: 6px;
                    }
                    
                    .popular-open-btn {
                        padding: 6px 12px;
                        font-size: 0.8rem;
                        min-width: 50px;
                    }
                }
            `;
            
            document.head.appendChild(style);
        }

        attachPopupEventListeners(popup, popularApps) {
            // Close button
            const closeBtn = popup.querySelector('.popular-close-btn');
            if (closeBtn) {
                closeBtn.addEventListener('click', () => {
                    this.closePopularAppsPopup();
                });
            }
            
            // Overlay click to close
            popup.addEventListener('click', (e) => {
                if (e.target === popup) {
                    this.closePopularAppsPopup();
                }
            });
            
            // Open buttons
            const openButtons = popup.querySelectorAll('.popular-open-btn');
            openButtons.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const appName = btn.dataset.app;
                    this.handleAppOpen(appName);
                });
            });
            
            // Row clicks
            const appRows = popup.querySelectorAll('.popular-app-row');
            appRows.forEach(row => {
                row.addEventListener('click', (e) => {
                    // Prevent if clicked on button
                    if (e.target.classList.contains('popular-open-btn')) return;
                    
                    const appName = row.dataset.app;
                    this.handleAppOpen(appName);
                });
            });
            
            // ESC key
            const escHandler = (e) => {
                if (e.key === 'Escape') {
                    this.closePopularAppsPopup();
                    document.removeEventListener('keydown', escHandler);
                }
            };
            document.addEventListener('keydown', escHandler);
        }

        handleAppOpen(appName) {
            this.log(`🎯 Opening app: ${appName}`);
            
            // Track click
            this.trackAppView(appName, 'popular_click');
            
            // Close popup
            this.closePopularAppsPopup();
            
            // Find and open app
            if (typeof window.apps !== 'undefined') {
                const app = window.apps.find(a => a.name === appName);
                if (app) {
                    // Delay to allow popup close animation
                    setTimeout(() => {
                        if (typeof window.showAppPopup === 'function') {
                            window.showAppPopup(app, 'auto');
                        } else if (app.supported && typeof window.showInstallPopup === 'function') {
                            window.showInstallPopup(app);
                        } else if (typeof window.showAboutPopup === 'function') {
                            window.showAboutPopup(app);
                        }
                    }, 300);
                }
            }
        }

        closePopularAppsPopup() {
            const popup = document.getElementById('popular-apps-popup');
            if (popup) {
                popup.classList.remove('visible');
                
                // Remove after animation
                setTimeout(() => {
                    if (document.body.contains(popup)) {
                        document.body.removeChild(popup);
                    }
                }, 400);
                
                this.log('🔥 Popular apps popup kapatıldı');
            }
        }

        // ============ REST OF THE CLASS ============
        async getStats() {
            if (CONFIG.OFFLINE_MODE) {
                return { total_events: 0, unique_apps: 0, total_views: 0 };
            }

            try {
                const response = await fetch(`${CONFIG.API_BASE}?action=stats`);
                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                
                const result = await response.json();
                return result.success ? result.stats : null;
            } catch (error) {
                this.error('Stats getirme hatası:', error);
                return null;
            }
        }

        // ============ EVENT LISTENERS ============
        setupEventListeners() {
            document.addEventListener('visibilitychange', () => {
                if (document.hidden) {
                    this.sendBatch();
                } else {
                    setTimeout(() => {
                        this.getPopularApps(8, '7d', false);
                    }, 2000);
                }
            });

            window.addEventListener('online', () => {
                this.isOnline = true;
                CONFIG.OFFLINE_MODE = false;
                this.processRetryQueue();
            });

            window.addEventListener('offline', () => {
                this.isOnline = false;
                CONFIG.OFFLINE_MODE = true;
            });
        }

        setupPeriodicTasks() {
            setInterval(() => {
                if (this.isOnline && !CONFIG.OFFLINE_MODE) {
                    this.processRetryQueue();
                }
            }, 60000);

            setInterval(() => {
                this.getPopularApps(8, '7d', false);
            }, CONFIG.POPULAR_CACHE_TTL);
        }

        setupUnloadHandler() {
            window.addEventListener('beforeunload', () => {
                if (this.eventQueue.length > 0) {
                    this.sendBeaconBatch();
                }
            });
        }

        sendBeaconBatch() {
            if (!navigator.sendBeacon || this.eventQueue.length === 0 || CONFIG.OFFLINE_MODE) return;

            const events = [...this.eventQueue];
            this.eventQueue = [];

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
        }

        async processRetryQueue() {
            if (this.retryQueue.length === 0) return;

            const events = [...this.retryQueue];
            this.retryQueue = [];

            try {
                const promises = events.map(event => this.sendEvent(event));
                await Promise.allSettled(promises);
            } catch (error) {
                this.error('Retry queue işleme hatası:', error);
            }
        }

        // ============ PUBLIC API ============
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
    }

    // ============ GLOBAL SETUP ============
    window.AnalyticsSystem = new AnalyticsSystem();
    
    // Development mode debug
    if (window.location.hostname === 'localhost' || 
        window.location.hostname === '127.0.0.1' || 
        window.location.hostname.includes('192.168.')) {
        window.AnalyticsSystem.log('🧪 Development mode detected');
    }

    // Console helpers
    window.analyticsDebug = {
        status: () => window.AnalyticsSystem.getQueueStatus(),
        popular: () => window.AnalyticsSystem.getPopularApps(),
        showPopular: () => window.AnalyticsSystem.calculatePopularApps(),
        track: (app, action) => window.AnalyticsSystem.trackAppView(app, action),
        testPopup: () => {
            const testData = [
                { name: 'Discord', stats: { views: 150, installs: 45, abouts: 20 } },
                { name: 'Visual Studio Code', stats: { views: 134, installs: 67, abouts: 15 } },
                { name: 'Spotify', stats: { views: 98, installs: 23, abouts: 12 } }
            ];
            window.AnalyticsSystem.showPopularAppsPopup(testData);
        }
    };

    console.log('📊 Analytics System yüklendi ve hazır (POPUP FIXED VERSION)');
    console.log('🧪 Debug için: window.analyticsDebug.testPopup() - Test popup\'ı göster');
    console.log('🧪 Debug için: window.analyticsDebug.showPopular() - Gerçek popup\'ı göster');

})();
