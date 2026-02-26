const fetch = require('node-fetch');

async function testGemini() {
    const GEMINI_API_KEY = "AIzaSyCCNrTE86_9kbXBs9OWIGHSSscZiCW9Qj8";
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

    console.log("Testing Gemini API connection...");

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ role: "user", parts: [{ text: "Привет! Ты работаешь? Ответь одним словом 'Да'." }] }]
            })
        });

        if (!response.ok) {
            const err = await response.json();
            console.error("API Error:", JSON.stringify(err, null, 2));
            return;
        }

        const data = await response.json();
        console.log("Success! Response:", data.candidates[0].content.parts[0].text);
    } catch (e) {
        console.error("Connection Error:", e.message);
    }
}

testGemini();
