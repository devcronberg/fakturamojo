import { extractTextFromPDF } from './pdf.js';
import { getDefaultModel, callOpenRouter, getSystemPrompt } from './openrouter.js';
import { logInfo, logError, groupStart, groupEnd } from './log.js';


document.addEventListener('DOMContentLoaded', () => {
    logInfo('DOM loaded');
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const apiKeyInput = document.getElementById('apiKey');
    const modelNameInput = document.getElementById('modelName');

    modelNameInput.placeholder = "Feks. " + getDefaultModel();

    logInfo('Finder API key');
    const saved = localStorage.getItem('API_KEY');
    if (saved) apiKeyInput.value = saved;
    apiKeyInput.addEventListener('blur', () => {
        const key = apiKeyInput.value.trim();
        if (key) localStorage.setItem('API_KEY', key);
        logInfo('API key gemt:', key);
    });


    const savedModel = localStorage.getItem('MODEL_NAME');
    logInfo('Finder model name: ' + savedModel);
    if (savedModel) modelNameInput.value = savedModel;
    else modelNameInput.value = getDefaultModel();
    modelNameInput.addEventListener('blur', () => {
        const model = modelNameInput.value.trim();
        if (model) localStorage.setItem('MODEL_NAME', model);
        logInfo('Model name gemt:', model);
    });

    dropZone.addEventListener('click', () => fileInput.click());
    dropZone.addEventListener('dragover', e => { e.preventDefault(); dropZone.classList.add('bg-gray-50'); });
    dropZone.addEventListener('dragleave', () => dropZone.classList.remove('bg-gray-50')); dropZone.addEventListener('drop', e => {
        e.preventDefault();
        dropZone.classList.remove('bg-gray-50');
        const file = e.dataTransfer.files[0];
        logInfo('File dropped:', file);
        if (file && file.type === 'application/pdf') {
            handleFile(file);
        } else {
            alert('Kun PDF-filer er understøttet. Vælg venligst en PDF-fil.');
        }
    });
    fileInput.addEventListener('change', () => {
        logInfo('File selected:' + fileInput.files[0]);
        const file = fileInput.files[0];
        if (file && file.type === 'application/pdf') {
            handleFile(file);
        } else {
            alert('Kun PDF-filer er understøttet. Vælg venligst en PDF-fil.');
        }
    });
    groupEnd();
});


function showLoading(message = 'Behandler dokument...') {
    logInfo('Viser loading overlay med besked: ' + message);
    const loadingOverlay = document.getElementById('loadingOverlay');
    const loadingMessage = document.getElementById('loadingMessage');
    loadingMessage.textContent = message;
    loadingOverlay.classList.remove('hidden');
}

function hideLoading() {
    logInfo('Skjuler loading overlay');
    const loadingOverlay = document.getElementById('loadingOverlay');
    loadingOverlay.classList.add('hidden');
}

async function handleFile(file) {
    try {
        logInfo('Håndterer fil: ' + file.name);

        showLoading('Udtrækker tekst fra PDF...');
        const text = await extractTextFromPDF(file);
        groupStart('Udtrukket tekst fra PDF');
        logInfo('Udtrukket tekst fra PDF ' + text.slice(0, 500) + '...');
        groupEnd();

        const key = localStorage.getItem('API_KEY') || document.getElementById('apiKey').value.trim();
        const model = localStorage.getItem('MODEL_NAME') || document.getElementById('modelName').value.trim() || getDefaultModel();

        if (!key || !file) {
            hideLoading();
            alert('API-nøgle eller fil mangler!');
            return;
        }

        showLoading(`Analyserer dokument med AI (${model})...`);
        let systemMessage = await getSystemPrompt();
        const now = new Date();
        const dateStr = now.toISOString().slice(0, 10);
        const timeStr = now.toTimeString().slice(0, 5);
        systemMessage = systemMessage.replace(/{{dato}}/gi, dateStr).replace(/{{tid}}/gi, timeStr);
        groupStart('System prompt');
        logInfo('System prompt: ' + systemMessage);
        groupEnd();
        logInfo('Kalder OpenRouter API med model: ' + model);
        const result = await callOpenRouter(key, systemMessage, text, model);

        try {
            groupStart('AI svar');
            logInfo('AI svar modtaget: ' + result);
            groupEnd();
            const data = JSON.parse(result);
            logInfo('Parsed AI response: ' + JSON.stringify(data, null, 2));
            renderResults(data);
            hideLoading();
        } catch (error) {
            hideLoading();
            alert('Der opstod en fejl ved behandling af svaret fra AI: ' + error.message);
        }

    } catch (error) {
        hideLoading();
        alert('Der opstod en fejl ved behandling af filen: ' + error.message);
    }
}

function renderResults(data) {
    logInfo('Renderer resultater: ' + JSON.stringify(data, null, 2));
    const area = document.getElementById('resultArea');
    const body = document.getElementById('resultBody');
    body.innerHTML = '';
    const row = document.createElement('tr');
    [data.fik, data.beløb, data.forfaldsdato, data.beskrivelse, data.regnr, data.kontonr].forEach(text => {
        const td = document.createElement('td'); td.className = 'border px-2 py-1'; td.textContent = text || '-'; row.appendChild(td);
    });
    body.appendChild(row);
    area.classList.remove('hidden');
    logInfo('Resultater vist i tabel');
}

