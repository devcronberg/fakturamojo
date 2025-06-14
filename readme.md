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


