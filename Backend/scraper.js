const puppeteer = require('puppeteer');

class OddsScraper {
    constructor(username, password) {
        this.username = username;
        this.password = password;
        this.browser = null;
        this.page = null;
    }

    async setup() {
        this.browser = await puppeteer.launch({ headless: true });
        this.page = await this.browser.newPage();
        await this.page.setViewport({ width: 1280, height: 800 });
    }

    async login(url) {
        try {
            await this.page.goto(url, { waitUntil: 'networkidle2' });
            await this.page.type('input[name="userid"]', this.username);
            await this.page.type('input[name="password"]', this.password);
            await this.page.keyboard.press('Enter');
            await this.page.waitForNavigation();
            console.log("Login successful");
        } catch (error) {
            console.error("Login failed:", error);
        }
    }

    async navigateToEvent(eventUrl) {
        try {
            await this.page.goto(eventUrl, { waitUntil: 'networkidle2' });
            console.log("Navigated to event page");
        } catch (error) {
            console.error("Failed to navigate to event page:", error);
        }
    }

    async getOddsAndRates() {
        try {
            await this.page.waitForSelector('#oddsBody');
            
            return await this.page.evaluate(() => {
                const rows = document.querySelectorAll('#oddsBody tr.back_lay_color');
                let oddsData = {};
                
                rows.forEach(row => {
                    const runnerText = row.querySelector('.runner_text')?.innerText.trim() || "Unknown";
                    oddsData[runnerText] = {
                        "Back_Odds": row.querySelector('td:nth-child(4) span')?.innerText.trim() || "N/A",
                        "Lay_Odds": row.querySelector('td:nth-child(5) span')?.innerText.trim() || "N/A",
                        "Back_Rate": row.querySelector("span[id*='backPrice']")?.innerText.trim() || "N/A",
                        "Lay_Rate": row.querySelector("span[id*='layPrice']")?.innerText.trim() || "N/A"
                    };
                });
                return oddsData;
            });
        } catch (error) {
            console.error("Error fetching odds:", error);
            return {};
        }
    }

    async monitorOdds() {
        try {
            let previousData = await this.getOddsAndRates();
            console.log("Initial Data:", JSON.stringify(previousData, null, 4));
            
            while (true) {
                await this.page.waitForSelector('#oddsBody');
                let currentData = await this.getOddsAndRates();
                
                if (JSON.stringify(currentData) !== JSON.stringify(previousData)) {
                    console.log("Updated Odds & Rates:", JSON.stringify(currentData, null, 4));
                    previousData = currentData;
                }
                await new Promise(r => setTimeout(r, 5000)); // Wait before rechecking
            }
        } catch (error) {
            console.error("Monitoring error:", error);
        } finally {
            await this.browser.close();
            console.log("Browser closed");
        }
    }
}

(async () => {
    const scraper = new OddsScraper("c19601", "7777");
    await scraper.setup();
    await scraper.login("https://adaniexch.in/");
    await scraper.navigateToEvent("https://adaniexch.in/EVENT/4/34108955");
    console.log(await scraper.getOddsAndRates());
    await scraper.monitorOdds();
})();