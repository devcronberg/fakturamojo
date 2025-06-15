# Faktura Mojo

## Projektbeskrivelse
Faktura Mojo er en webapplikation designet til at ekstrahere betalingsoplysninger fra danske fakturaer og FIK-indbetalingskort ved hjælp af AI. Applikationen er udviklet som et single-page værktøj der kører client-side og bruger PDF.js til at ekstrahere tekst fra PDF-filer og OpenRouter API til at behandle denne tekst med AI-modeller.

## Teknologisk Stack
- **Frontend**: Vanilla JavaScript uden frameworks (brug sidste nye version af JS - herunder brug af ES6-moduler hvor det er muligt)
- **UI**: Tailwind CSS (via CDN) for styling
- **PDF Processering**: PDF.js bibliotek (ekstern CDN) i sidste nye version
- **AI Integration**: OpenRouter API til at tilgå forskellige LLM-modeller

## Kernekomponenter

### 1. PDF Tekst Ekstraktion
- Bruger `pdf.js` for at konvertere PDF til tekst
- Håndterer PDF filbehandling gennem `pdf.js` fil der indeholder:
  - `extractTextFromPDF(file)`: Konverterer PDF-filen til tekst
  - `waitForPdfJs()`: Sikrer at PDF.js er korrekt indlæst før brug

### 2. OpenRouter API Integration
- `openrouter.js` håndterer kommunikation med OpenRouter API
- Funktioner:
  - `callOpenRouter(apiKey, systemMessage, userMessage, model)`: Sender forespørgsel til valgt AI model
  - `getSystemPrompt()`: Indlæser system prompt til AI'en fra ekstern fil

### 3. Applikationslogik
- `app.js` indeholder hovedlogikken:
  - Håndtering af brugerinteraktion og filvalg
  - Processering af PDF til tekst
  - Kald til OpenRouter API med systemPrompt og ekstraheret tekst
  - Rendering af resultater i UI
  - Persistens af brugerdata (API nøgle, model valg) via localStorage

### 4. AI Prompt Engineering
- `systemprompt.txt` indeholder den specialiserede systembesked til AI
- Prompt er designet til at analysere dansk fakturatekst og returnere specifik struktureret data
- AI bedes om at genkende og udtrække:
  - FIK-koder (betalings-ID)
  - Beløb
  - Forfaldsdato
  - Beskrivelser, fakturanumre
  - Bank kontooplysninger

## Dataflow
1. Bruger vælger en PDF-fil (via drag-n-drop eller fil dialog)
2. Appen ekstrakter tekstindhold fra PDF'en ved hjælp af PDF.js
3. Den ekstraherede tekst sendes til AI via OpenRouter
4. AI analyserer teksten baseret på systemprompten
5. Svaret fra AI'en parses til JSON og vises i brugergrænsefladen

## UI/UX Elementer
- Tekstfelt til API-nøgle (med lokal lagring)
- Tekstfelt til valg af AI-model
- Drag-and-drop zone for PDF upload
- Loading overlay med animation
- Resultat tabel med udtrukne fakturadata

## Begrænsninger og Ansvarsfraskrivelse
- Applikationen er afhængig af korrekt tekst-ekstraktion fra PDF'er
- AI-analysen er baseret på statistisk forståelse og kan fejle
- Resultater bør altid verificeres manuelt før brug
- Applikationen er designet til danske fakturaer og FIK-indbetalingskort
- Brugere bruger applikationen på eget ansvar

## Tekniske Detaljer

### PDF.js Integration
- Bruger asynkron PDF-behandling
- Robust fejlhåndtering og ventetid på korrekt initialisering
- Ekstraktion af tekst fra alle PDF-sider

### OpenRouter API Implementering
- Support for multiple AI-modeller (både gratis og betalte)
- Korrekt formatering af API forespørgsler med system og bruger prompts
- Error handling og parsing af API svar

### Sikkerhed
- API-nøgle gemmes lokalt på brugerens enhed
- Ingen serverside datalagring eller -behandling
- Al databehandling sker lokalt i browseren


