// api/simple.js - En basit test

export default function handler(request) {
    return new Response('Hello World!', {
        status: 200,
        headers: { 'Content-Type': 'text/plain' }
    });
}
