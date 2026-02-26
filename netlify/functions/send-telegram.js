exports.handler = async (event) => {
    // CORS headers
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Content-Type': 'application/json'
    };

    // Handle preflight
    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 204, headers, body: '' };
    }

    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
    }

    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

    if (!BOT_TOKEN || !CHAT_ID) {
        return { statusCode: 500, headers, body: JSON.stringify({ error: 'Telegram not configured' }) };
    }

    try {
        const { text } = JSON.parse(event.body);

        if (!text) {
            return { statusCode: 400, headers, body: JSON.stringify({ error: 'Text is required' }) };
        }

        const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: CHAT_ID,
                text: text,
                parse_mode: 'HTML'
            })
        });

        const data = await response.json();

        if (!data.ok) {
            return { statusCode: 500, headers, body: JSON.stringify({ error: 'Telegram API error', details: data.description }) };
        }

        return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
    } catch (error) {
        return { statusCode: 500, headers, body: JSON.stringify({ error: 'Internal error' }) };
    }
};
