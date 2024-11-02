import puppeteer from "puppeteer";

async function run() {
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: false
    });
    const page = await browser.newPage();
    
    await page.goto('https://quotes.toscrape.com/scroll', { waitUntil: "domcontentloaded" });

    // Scroll to the bottom of the page
    const scrollTimes = async (times) => {
        for (let i = 0; i < times; i++) {
            await page.evaluate(async () => {
                const distance = window.innerHeight; // Scroll by the viewport height
                window.scrollBy(0, distance);
            });

            await new Promise(resolve => setTimeout(resolve, 500)); // Wait for content to load
        }
    };

    await scrollTimes(100);

    // Get quotes
    const quotes = await page.$('.quote'); // Use $ to get all quotes
    for (const quoteElement of quotes) {
        const quoteText = await page.evaluate(el => el.querySelector('.text').innerText, quoteElement);
        console.log(quoteText);
    }

    await browser.close();
}

run();
