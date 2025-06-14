async function extractTextFromPDF(file) {
    if (typeof pdfjsLib === 'undefined') {
        throw new Error('PDF.js er ikke indlæst');
    }

    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

    let fullText = '';
    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const strings = content.items.map(item => item.str);
        fullText += `\n[Side ${i}]\n` + strings.join(' ');
    }

    return fullText;
}

function isPdfJsReady() {
    return window.pdfJsLoaded || typeof pdfjsLib !== 'undefined';
}

async function waitForPdfJs() {
    if (!isPdfJsReady()) {
        for (let i = 0; i < 20; i++) {
            await new Promise(r => setTimeout(r, 250));
            if (isPdfJsReady()) {
                window.pdfJsLoaded = true;
                break;
            }
        }

        if (!isPdfJsReady()) {
            throw new Error('PDF.js kunne ikke indlæses. Prøv at genindlæse siden.');
        }
    }
}
