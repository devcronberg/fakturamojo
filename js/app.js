import { extractTextFromPDF } from './pdf.js';
import { getDefaultModel, callOpenRouter, getSystemPrompt } from './openrouter.js';

document.addEventListener('DOMContentLoaded', () => {
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const apiKeyInput = document.getElementById('apiKey');
    const modelNameInput = document.getElementById('modelName');

    modelNameInput.placeholder = "Feks. " + getDefaultModel();

    // Indlæs API nøgle fra localStorage
    const saved = localStorage.getItem('API_KEY');
    if (saved) apiKeyInput.value = saved;
    apiKeyInput.addEventListener('blur', () => {
        const key = apiKeyInput.value.trim();
        if (key) localStorage.setItem('API_KEY', key);
    });

    const savedModel = localStorage.getItem('MODEL_NAME');
    if (savedModel) modelNameInput.value = savedModel;
    else modelNameInput.value = getDefaultModel();
    modelNameInput.addEventListener('blur', () => {
        const model = modelNameInput.value.trim();
        if (model) localStorage.setItem('MODEL_NAME', model);
    });

    dropZone.addEventListener('click', () => fileInput.click());
    dropZone.addEventListener('dragover', e => { e.preventDefault(); dropZone.classList.add('bg-gray-50'); });
    dropZone.addEventListener('dragleave', () => dropZone.classList.remove('bg-gray-50')); dropZone.addEventListener('drop', e => {
        console.clear();
        e.preventDefault();
        dropZone.classList.remove('bg-gray-50');
        const file = e.dataTransfer.files[0];
        if (file && file.type === 'application/pdf') {
            handleFile(file);
        } else {
            alert('Kun PDF-filer er understøttet. Vælg venligst en PDF-fil.');
        }
    });
    fileInput.addEventListener('change', () => {
        const file = fileInput.files[0];
        if (file && file.type === 'application/pdf') {
            handleFile(file);
        } else {
            alert('Kun PDF-filer er understøttet. Vælg venligst en PDF-fil.');
        }
    });
});


function showLoading(message = 'Behandler dokument...') {
    const loadingOverlay = document.getElementById('loadingOverlay');
    const loadingMessage = document.getElementById('loadingMessage');
    loadingMessage.textContent = message;
    loadingOverlay.classList.remove('hidden');
}

function hideLoading() {
    const loadingOverlay = document.getElementById('loadingOverlay');
    loadingOverlay.classList.add('hidden');
}

async function handleFile(file) {
    try {

        showLoading('Udtrækker tekst fra PDF...');
        const text = await extractTextFromPDF(file);

        const key = localStorage.getItem('API_KEY') || document.getElementById('apiKey').value.trim();
        const model = localStorage.getItem('MODEL_NAME') || document.getElementById('modelName').value.trim() || getDefaultModel();

        if (!key || !file) {
            hideLoading();
            alert('API-nøgle eller fil mangler!');
            return;
        }

        showLoading(`Analyserer dokument med AI (${model})...`);
        let systemMessage = await getSystemPrompt();
        // Indsæt dato og tid i system prompt
        const now = new Date();
        const dateStr = now.toISOString().slice(0, 10); // yyyy-mm-dd
        const timeStr = now.toTimeString().slice(0, 5); // HH:MM
        systemMessage = systemMessage.replace(/{{dato}}/gi, dateStr).replace(/{{tid}}/gi, timeStr);
        console.log('System prompt:', systemMessage);
        const result = await callOpenRouter(key, systemMessage, text, model);

        try {
            const data = JSON.parse(result);
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
    const area = document.getElementById('resultArea');
    const body = document.getElementById('resultBody');
    body.innerHTML = '';
    const row = document.createElement('tr');
    [data.fik, data.beløb, data.forfaldsdato, data.beskrivelse, data.regnr, data.kontonr].forEach(text => {
        const td = document.createElement('td'); td.className = 'border px-2 py-1'; td.textContent = text || '-'; row.appendChild(td);
    });
    body.appendChild(row);
    area.classList.remove('hidden');
}

