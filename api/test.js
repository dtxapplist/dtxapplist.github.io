// api/test.js - Basit test endpoint

export default async function handler(request) {
    try {
        // Environment variables kontrolü
        const kvUrl = process.env.KV_REST_API_URL;
        const kvToken = process.env.KV_REST_API_TOKEN;
        
        return new Response(JSON.stringify({
            success: true,
            message: "API çalışıyor!",
            method: request.method,
            url: request.url,
            timestamp: Date.now(),
            environment: {
                kvUrl: kvUrl ? "✅ Var" : "❌ Yok",
                kvToken: kvToken ? "✅ Var" : "❌ Yok"
            }
        }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        });
        
    } catch (error) {
        return new Response(JSON.stringify({
            success: false,
            error: error.message,
            stack: error.stack
        }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        });
    }
}
