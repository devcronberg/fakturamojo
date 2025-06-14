# Faktura Mojo

Faktura Mojo er en webapplikation, der hjælper med at ekstrahere data fra danske fakturaer og FIK-indbetalingskort (Fælles Indbetalingskort) ved hjælp af AI.

## Hvad gør applikationen?

Applikationen kan analysere PDF-fakturaer og udtrække vigtige oplysninger som:
- FIK-koder (betalings-ID)
- Beløb
- Forfaldsdato
- Beskrivelse af betaling
- Registreringsnummer og kontonummer for direkte bankoverførsel

Disse oplysninger kan bruges til hurtigt at oprette betalinger ved at kopiere data og dermed ikke indtaste alle detaljer manuelt.

## Hvordan virker det?

1. Applikationen bruger PDF.js til at udtrække tekst fra uploadede PDF-filer
2. Den ekstraherede tekst sendes til en AI-model via OpenRouter API
3. AI-modellen analyserer teksten og identificerer relevante betalingsoplysninger
4. Resultaterne vises i en overskuelig tabel

## Prøv det selv!

Du kan prøve applikationen direkte i din browser ved at besøge [Faktura Mojo på Github Pages](https://devcronberg.github.io/fakturamojo/). Husk at læse nedenstående omkring datasikkerhed før du bruger den.

### Kør lokalt

Du kan også køre applikationen lokalt på din egen computer ved at følge disse trin:

1. **Download koden**
   - **Metode 1 (GitHub)**: Klon repository med `git clone https://github.com/devcronberg/fakturamojo.git`
   - **Metode 2 (ZIP)**: [Download ZIP-filen](https://github.com/devcronberg/fakturamojo/archive/refs/heads/main.zip) og udpak den til en mappe

2. **Start en lokal webserver**
   - Da applikationen bruger JavaScript-moduler og API-kald, kræver den en webserver (kan ikke køres direkte fra filsystemet)
   - Den nemmeste metode er at bruge Visual Studio Code med Live Server:
     1. [Download og installer Visual Studio Code](https://code.visualstudio.com/download) hvis du ikke allerede har det
     2. Åbn VS Code og installer "Live Server" extension:
        - Klik på Extensions ikonet i venstre sidebar (eller tryk `Ctrl+Shift+X`)
        - Søg efter "Live Server" (af Ritwick Dey)
        - Klik "Install"
     3. Åbn mappen med Faktura Mojo-koden i VS Code
     4. Klik på "Go Live" i nederste højre hjørne af VS Code
     5. En browser åbnes automatisk med applikationen kørende på en lokal server (typisk http://127.0.0.1:5500)

3. **Brug applikationen**
   - Indtast din OpenRouter API-nøgle
   - Vælg en AI-model
   - Upload en PDF-faktura

### Leg med koden og prompt

Når du har projektet kørende lokalt, kan du nemt tilpasse og forbedre applikationen:

1. **Rediger koden**
   - HTML og JavaScript-filerne kan redigeres direkte i VS Code
   - Live Server opdaterer automatisk browseren når du gemmer ændringer, så du straks kan se effekten
   - Strukturen er enkel: `index.html`, `js/app.js`, `js/openrouter.js`, `js/pdf.js` og `prompts/systemprompt.txt`

2. **Brug GitHub Copilot**
   - Projektet indeholder en særlig `.github/copilot-instructions.md` fil, som hjælper GitHub Copilot med at forstå projektet
   - Med en GitHub Copilot-konto (gratis op til et vist forbrug) kan du få intelligente kodeforslag
   - Copilot vil have bedre kontekst om applikationen og kan hjælpe med at udvide funktionaliteten eller fikse problemer

3. **Eksperimenter med prompt engineering**
   - Prøv at justere systemprompten i `prompts/systemprompt.txt` for at ændre hvordan AI'en analyserer fakturaerne
   - Test forskellige AI-modeller for at se hvilken der giver de bedste resultater
   
> 💡 **Tip**: Når du kører applikationen lokalt, får du den samme funktionalitet som på den offentlige version, men med fordelen af at kunne inspicere og ændre koden selv.

## Krav og opsætning

### Forudsætninger:

1. **OpenRouter API-nøgle (PÅKRÆVET)**
   - Opret en gratis konto på [OpenRouter](https://openrouter.ai/)
   - Generer en API-nøgle fra dit dashboard
   - Indtast nøglen i applikationen

2. **Valg af AI-Model**
   - Applikationen understøtter alle modeller tilgængelige på OpenRouter
   - Du kan vælge mellem [gratis modeller](https://openrouter.ai/models?q=free) eller [betalte modeller](https://openrouter.ai/models)

### Filtyper:
- Applikationen understøtter **kun PDF-filer**

## 🔒 Datasikkerhed

- API-nøglen gemmes **kun lokalt** i din browser's localStorage, men sendes med til OpenRouter's API
- PDF-filer behandles **udelukkende lokalt** i browseren ved hjælp af PDF.js
- Den ekstraherede **tekst** fra PDF-filen sendes til OpenRouter's API for AI-analyse
- **Selve PDF-filen** uploaderes aldrig til nogen server og forlader aldrig din computer
- Der er **ingen serverdel** i applikationen - alt kører i din browser
- Der foretages **ingen datalagring** udover den lokale API-nøgle og model-valg i localStorage

**Vær opmærksom på:** Selvom PDF-filen forbliver på din computer, sendes den ekstraherede tekst til OpenRouter, hvor den kan blive behandlet af deres tjenester ifølge deres [privatlivspolitik](https://openrouter.ai/privacy).

## ⚠️ Ansvarsfraskrivelse

**BRUG PÅ EGET ANSVAR!**

- AI-modellen giver et kvalificeret gæt baseret på den tekst, der kan udtrækkes fra fakturaen
- Informationer som beløb, bankkonti, FIK-koder og forfaldsdatoer kan være **ukorrekte**
- Dobbelttjek altid de ekstraherede oplysninger mod den originale faktura før betaling
- App-udvikleren påtager sig intet ansvar for fejlagtige betalinger eller andre problemer, der opstår som følge af brug af denne applikation

## Teknisk implementering

Applikationen er bygget med:
- VSCode og Github Copilot til udvikling
- JavaScript (vanilla)
- PDF.js til PDF-tekstekstraktion
- OpenRouter API til AI-tekstanalyse
- Tailwind CSS til styling
- Favicon fra [https://gauger.io/fonticon/](https://gauger.io/fonticon/)

## Licens

Se [LICENSE](LICENSE) fil for licensoplysninger.

## Issues og Pull Requests

Dette projekt er open source, og alle er velkomne til at bidrage!

- **Fejl og forbedringer:** Hvis du finder en fejl, har forslag til forbedringer eller ønsker nye funktioner, så opret gerne et issue på GitHub.
- **Pull Requests:** Hvis du selv har rettet en fejl eller tilføjet en funktion, er du meget velkommen til at oprette en pull request (PR). Fork blot projektet, lav dine ændringer og send en PR – så kigger jeg på det hurtigst muligt.

### Fremtidige Udviklingsmuligheder

- Mulighed for at bruge en lokal model og undgå OpenRouter API
- Mulighed for at gemme og eksportere udtrukne data
- Forbedret fejlhåndtering ved dårlig PDF-kvalitet
- Mulighed for batch-processering af flere fakturaer
- Mulighed for direkte integration til betalingssystemer
- Implementering af OCR til billeder og scannede dokumenter

