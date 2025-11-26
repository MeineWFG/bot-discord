const puppeteer = require('puppeteer');
const { AttachmentBuilder } = require('discord.js');

let browser;
let page; // page globale réutilisable

// Initialisation du navigateur
async function initBrowser() {
    if (!browser) {
        browser = await puppeteer.launch({
            headless: 'new',
            executablePath: '/usr/bin/chromium-browser',
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-background-timer-throttling',
                '--disable-backgrounding-occluded-windows',
                '--disable-renderer-backgrounding',
                '--disable-extensions',
                '--disable-gpu',
                '--disable-software-rasterizer',
                '--disable-features=TranslateUI,BlinkGenPropertyTrees',
            ],
        });
    }
    return browser;
}

// Initialisation d'une page réutilisable
async function initPage() {
    if (!page) {
        const browser = await initBrowser();
        page = await browser.newPage();
        await page.setViewport({ width: 800, height: 600 });
        await page.setUserAgent(
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        );
    }
    return page;
}

// Fonction principale
async function fantasyUpdate(url, channel) {
    const page = await initPage();

    try {
        // Aller sur la page
        const response = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });

        if (!response || response.status() >= 400) {
            return channel.send(
                `Impossible de charger la page. Statut HTTP : ${response ? response.status() : 'inconnu'}`
            );
        }

        // Cliquer sur "Allow all cookies" si présent
        const cookieBtn = await page.$('.CybotCookiebotDialogBodyButton');
        if (cookieBtn) {
            await cookieBtn.click();
        }

        // Essayer de sélectionner l'élément fantasy
        const elem = await page.waitForSelector('.fantasy-team-overview', { timeout: 1000 }).catch(() => null);

        let screenshotBuffer;
        if (elem) {
            screenshotBuffer = await elem.screenshot();
        } else {
            // Capture du viewport seulement si l'élément n'existe pas
            screenshotBuffer = await page.screenshot({ fullPage: false });
        }

        const attachment = new AttachmentBuilder(screenshotBuffer, { name: 'screenshot.png' });
        await channel.send({ files: [attachment] });

    } catch (err) {
        console.error(err);
        await channel.send('Une erreur est survenue lors du chargement de la page.');
    }
}

// Initialisation préventive du navigateur au démarrage du bot
(async () => {
    await initBrowser();
    await initPage();
})();

module.exports = { fantasyUpdate };