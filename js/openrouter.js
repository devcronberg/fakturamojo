function getDefaultModel() {
    return "google/gemma-3-27b-it:free";
}

async function callOpenRouter(apiKey, systemMessage, userMessage, model = "deepseek/deepseek-chat-v3-0324:free") {
    const url = 'https://openrouter.ai/api/v1/chat/completions';

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
            'HTTP-Referer': window.location.href,
            'X-Title': 'Faktura Mojo'
        },
        body: JSON.stringify({
            model: model,
            messages: [
                {
                    role: 'system',
                    content: systemMessage
                },
                {
                    role: 'user',
                    content: userMessage
                }
            ]
        })
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`OpenRouter API fejlede: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    return data.choices[0].message.content.replace(/^```json\s*|^```|```$/gim, '').trim();
}

async function getSystemPrompt() {
    const response = await fetch('prompts/systemprompt.txt');
    if (!response.ok) {
        throw new Error('Kunne ikke indlæse systemprompt.txt');
    }
    return await response.text();
}
