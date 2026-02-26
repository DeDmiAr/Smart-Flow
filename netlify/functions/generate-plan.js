const fetch = require('node-fetch');

exports.handler = async (event) => {
    // Проверка метода (только POST)
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    try {
        const { idea } = JSON.parse(event.body);
        const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

        if (!GEMINI_API_KEY) {
            return {
                statusCode: 500,
                body: JSON.stringify({ error: "GEMINI_API_KEY not configured on server" })
            };
        }

        // Параметры для Gemini (те же, что были на фронтенде)
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;
        const tools = Array.isArray(idea.tools) ? idea.tools : [];
        const systemPrompt = `Ты 'AutoIdea', бизнес-консультант. Создай пошаговый план внедрения (5-7 шагов). Отвечай ТОЛЬКО текстом, без HTML тегов. Каждый шаг с новой строки, нумерованный. Язык: Русский.`;
        const userPrompt = `Идея: ${idea.title}. Описание: ${idea.description}. Инструменты: ${tools.join(', ')}.`;

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ role: "user", parts: [{ text: userPrompt }] }],
                systemInstruction: { parts: [{ text: systemPrompt }] },
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Gemini API Error:", errorData);
            return {
                statusCode: response.status,
                body: JSON.stringify({ error: "Error from Gemini API" })
            };
        }

        const data = await response.json();
        const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

        return {
            statusCode: 200,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*", // CORS если нужно
            },
            body: JSON.stringify({ text: generatedText })
        };

    } catch (error) {
        console.error("Internal Error:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        };
    }
};
