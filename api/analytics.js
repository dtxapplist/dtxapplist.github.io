// api/analytics.js - Vercel Edge Function
// Bu dosyayı projenizin root/api/ klasörüne yerleştirin

import { kv } from '@vercel/kv';

const RATE_LIMIT_MAX = 100; // IP başına dakikada maksimum istek
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 dakika (ms)

// Rate limiting için utility
async function checkRateLimit(ip) {
    const key = `rate_limit:${ip}`;
    const current = await kv.get(key);
    
    if (!current) {
        await kv.set(key, 1, { ex: 60 }); // 60 saniye TTL
        return true;
    }
    
    if (current >= RATE_LIMIT_MAX) {
        return false;
    }
    
    await kv.incr(key);
    return true;
}

// Ana handler fonksiyonu
export default async function handler(request) {
    // CORS headers
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    };

    // OPTIONS request için preflight
    if (request.method === 'OPTIONS') {
        return new Response(null, { 
            status: 200, 
            headers: corsHeaders 
        });
    }

    try {
        // IP adresini al (rate limiting için)
        const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 
                  request.headers.get('x-real-ip') || 
                  'unknown';

        // Rate limiting kontrolü
        const rateLimitOk = await checkRateLimit(ip);
        if (!rateLimitOk) {
            return new Response(JSON.stringify({ 
                error: 'Rate limit exceeded' 
            }), {
                status: 429,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
        }

        const url = new URL(request.url);
        const action = url.searchParams.get('action');

        switch (action) {
            case 'track':
                return await handleTrack(request, corsHeaders);
            case 'popular':
                return await handleGetPopular(request, corsHeaders);
            case 'stats':
                return await handleGetStats(request, corsHeaders);
            default:
                return new Response(JSON.stringify({ 
                    error: 'Invalid action' 
                }), {
                    status: 400,
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                });
        }

    } catch (error) {
        console.error('Analytics API Error:', error);
        return new Response(JSON.stringify({ 
            error: 'Internal server error',
            message: error.message 
        }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
}

// Uygulama görüntüleme takibi
async function handleTrack(request, corsHeaders) {
    if (request.method !== 'POST') {
        return new Response(JSON.stringify({ 
            error: 'Method not allowed' 
        }), {
            status: 405,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }

    try {
        const { appName, actionType, timestamp } = await request.json();

        if (!appName || !actionType) {
            return new Response(JSON.stringify({ 
                error: 'Missing required fields: appName, actionType' 
            }), {
                status: 400,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
        }

        // Geçerli action type kontrolü
        const validActions = ['view', 'about', 'install', 'copy_command'];
        if (!validActions.includes(actionType)) {
            return new Response(JSON.stringify({ 
                error: 'Invalid action type' 
            }), {
                status: 400,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
        }

        const now = Date.now();
        const currentTimestamp = timestamp || now;
        
        // Hash için key oluştur
        const appKey = `app:${appName.toLowerCase().replace(/\s+/g, '_')}`;
        const dailyKey = `daily:${new Date(currentTimestamp).toISOString().split('T')[0]}`;
        
        // Redis pipeline benzeri batch operations
        const operations = [];

        // 1. App-specific tracking
        operations.push(
            kv.hincrby(appKey, `${actionType}_count`, 1),
            kv.hset(appKey, 'last_activity', currentTimestamp),
            kv.hset(appKey, 'app_name', appName) // Orijinal ismi sakla
        );

        // 2. Daily stats
        operations.push(
            kv.hincrby(dailyKey, `total_${actionType}`, 1),
            kv.hincrby(dailyKey, `apps_${appName.toLowerCase().replace(/\s+/g, '_')}`, 1)
        );

        // 3. Global stats
        operations.push(
            kv.hincrby('global_stats', `total_${actionType}`, 1),
            kv.hincrby('global_stats', 'total_interactions', 1)
        );

        // 4. Popular apps zaman damgalı tracking
        const popularKey = `popular:${appName.toLowerCase().replace(/\s+/g, '_')}`;
        operations.push(
            kv.zadd('popular_apps_sorted', { 
                score: currentTimestamp, 
                member: appName 
            }),
            kv.lpush(popularKey, JSON.stringify({
                action: actionType,
                timestamp: currentTimestamp
            })),
            kv.ltrim(popularKey, 0, 99) // Son 100 interaction'ı sakla
        );

        // Tüm operations'ı çalıştır
        await Promise.all(operations);

        // TTL ayarla (30 gün)
        const ttl = 30 * 24 * 60 * 60; // 30 gün
        await Promise.all([
            kv.expire(appKey, ttl),
            kv.expire(dailyKey, ttl),
            kv.expire(popularKey, ttl)
        ]);

        return new Response(JSON.stringify({
            success: true,
            tracked: {
                app: appName,
                action: actionType,
                timestamp: currentTimestamp
            }
        }), {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Track error:', error);
        return new Response(JSON.stringify({ 
            error: 'Failed to track event',
            message: error.message 
        }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
}

// Popüler uygulamaları getir
async function handleGetPopular(request, corsHeaders) {
    if (request.method !== 'GET') {
        return new Response(JSON.stringify({ 
            error: 'Method not allowed' 
        }), {
            status: 405,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }

    try {
        const url = new URL(request.url);
        const limit = Math.min(parseInt(url.searchParams.get('limit') || '10'), 50);
        const timeframe = url.searchParams.get('timeframe') || '7d'; // 1d, 7d, 30d

        // Zaman aralığı hesapla
        const now = Date.now();
        let since = now - (7 * 24 * 60 * 60 * 1000); // Default 7 gün

        switch (timeframe) {
            case '1d':
                since = now - (24 * 60 * 60 * 1000);
                break;
            case '30d':
                since = now - (30 * 24 * 60 * 60 * 1000);
                break;
        }

        // Sorted set'ten popüler uygulamaları al
        const popularApps = await kv.zrevrangebyscore(
            'popular_apps_sorted',
            now,
            since,
            { count: limit }
        );

        // Her uygulama için detaylı istatistikler al
        const appsWithStats = await Promise.all(
            popularApps.map(async (appName) => {
                const appKey = `app:${appName.toLowerCase().replace(/\s+/g, '_')}`;
                const stats = await kv.hgetall(appKey);
                
                return {
                    name: appName,
                    stats: {
                        views: parseInt(stats?.view_count || 0),
                        installs: parseInt(stats?.install_count || 0),
                        abouts: parseInt(stats?.about_count || 0),
                        copies: parseInt(stats?.copy_command_count || 0),
                        lastActivity: stats?.last_activity || null
                    },
                    score: (parseInt(stats?.view_count || 0) * 1) +
                           (parseInt(stats?.install_count || 0) * 3) +
                           (parseInt(stats?.about_count || 0) * 2) +
                           (parseInt(stats?.copy_command_count || 0) * 5)
                };
            })
        );

        // Score'a göre tekrar sırala
        appsWithStats.sort((a, b) => b.score - a.score);

        return new Response(JSON.stringify({
            success: true,
            timeframe,
            popular_apps: appsWithStats,
            total_found: appsWithStats.length,
            generated_at: now
        }), {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Get popular error:', error);
        return new Response(JSON.stringify({ 
            error: 'Failed to get popular apps',
            message: error.message 
        }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
}

// Genel istatistikleri getir
async function handleGetStats(request, corsHeaders) {
    if (request.method !== 'GET') {
        return new Response(JSON.stringify({ 
            error: 'Method not allowed' 
        }), {
            status: 405,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }

    try {
        // Global stats
        const globalStats = await kv.hgetall('global_stats') || {};
        
        // Bugünün stats'ı
        const today = new Date().toISOString().split('T')[0];
        const dailyStats = await kv.hgetall(`daily:${today}`) || {};

        // Toplam unique app sayısı
        const allAppKeys = await kv.keys('app:*');
        const uniqueApps = allAppKeys.length;

        return new Response(JSON.stringify({
            success: true,
            stats: {
                global: {
                    total_views: parseInt(globalStats.total_view || 0),
                    total_installs: parseInt(globalStats.total_install || 0),
                    total_abouts: parseInt(globalStats.total_about || 0),
                    total_copies: parseInt(globalStats.total_copy_command || 0),
                    total_interactions: parseInt(globalStats.total_interactions || 0),
                    unique_apps: uniqueApps
                },
                today: {
                    views: parseInt(dailyStats.total_view || 0),
                    installs: parseInt(dailyStats.total_install || 0),
                    abouts: parseInt(dailyStats.total_about || 0),
                    copies: parseInt(dailyStats.total_copy_command || 0)
                },
                generated_at: Date.now()
            }
        }), {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Get stats error:', error);
        return new Response(JSON.stringify({ 
            error: 'Failed to get stats',
            message: error.message 
        }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
