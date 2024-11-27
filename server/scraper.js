// const { connect } = require("puppeteer-real-browser");

// let browser = null;
// let page = null;

// const connectOptions = {
// 	headless: true,
// 	devtools: true,
// 	args: ["--disable-features=site-per-process", "--no-sandbox", "--disable-setuid-sandbox", "--disable-gpu"],
// 	customConfig: {},
// 	turnstile: true,
// 	connectOption: {},
// 	disableXvfb: false,
// 	ignoreAllFlags: false,
// };

// const viewPortOptions = { width: 1024, height: 768 };
// const ExtraHTTPHeadersOptions = { "accept-language": "en-US,en;q=0.9" };
// const userAgent =
// 	"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36";

const antibotbrowser = require("antibotbrowser");
const puppeteer = require("puppeteer");

async function safeGoto(page, url, retries = 3) {
	for (let attempt = 1; attempt <= retries; attempt++) {
		try {
			await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
			return; // Success
		} catch (error) {
			console.error(`Attempt ${attempt} failed:`, error.message);
			if (attempt === retries) throw error; // Throw error after max retries
		}
	}
}

async function safeEvaluate(page, selector, evaluateFn, errorMessage) {
	try {
		const element = await page.waitForSelector(selector, { timeout: 10000 });
		return await element.evaluate(evaluateFn);
	} catch (error) {
		console.error(errorMessage, error.message);
		return null; // Return null if the selector is not found or frame detaches
	}
}
async function scrapeWebsite(url, selectors) {
	let browser = null;
	let page = null;

	try {
		// Start browser with antibotbrowser
		const antibrowser = await antibotbrowser.startbrowser(9222); // Start browser on port 9222
		browser = await puppeteer.connect({ browserWSEndpoint: antibrowser.websokcet });

		// Create or get the first page
		const pages = await browser.pages();
		page = pages.length > 0 ? pages[0] : await browser.newPage();

		// Set basic configurations
		await page.setUserAgent(
			"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36"
		);
		await page.setViewport({ width: 1024, height: 768 });
		await page.setExtraHTTPHeaders({ "accept-language": "en-US,en;q=0.9" });

		// Wait for the body and navigate to the URL
		await page.waitForSelector("body", { timeout: 10000 });
		await safeGoto(page, url);

		// Extract data using selectors
		const src = await safeEvaluate(
			page,
			selectors.image,
			(el) => el.src,
			`Failed to extract image from selector: ${selectors.image}`
		);

		const title = await safeEvaluate(
			page,
			selectors.title,
			(el) => el.textContent.trim().toLowerCase(),
			`Failed to extract title from selector: ${selectors.title}`
		);

		const value = await safeEvaluate(
			page,
			selectors.price,
			(el) => el.textContent.trim(),
			`Failed to extract price from selector: ${selectors.price}`
		);

		// Add optional color field
		const color = selectors.color;

		return { src, value, title, color, url };
	} catch (error) {
		console.error("Scraping failed:", error.message);
		throw error;
	} finally {
		// Safely close page and browser
		if (page) {
			try {
				await page.close();
			} catch (closeError) {
				console.error("Failed to close page:", closeError.message);
			}
		}
		if (browser && browser.isConnected()) {
			try {
				await browser.close();
			} catch (closeError) {
				console.error("Failed to close browser:", closeError.message);
			}
		}
	}
}

const getFromSahibinden = (url) =>
	scrapeWebsite(url, {
		image: ".stdImg",
		title: ".classifiedDetailTitle h1",
		price: ".classified-price-wrapper",
		color: "#FFE800",
	});
const getFromLetgo = (url) =>
	scrapeWebsite(url, {
		image: ".img-container img",
		title: ".ad-name",
		price: ".summary-upper h2",
		color: "#FF3F55",
	});

const getFromHepsiEmlak = (url) =>
	scrapeWebsite(url, {
		image: ".img-wrapper img",
		title: ".det-title-upper h1",
		price: ".fz24-text.price",
		color: "#E1251B",
	});

const getFromEmlakJet = (url) =>
	scrapeWebsite(url, {
		image: "._1L9i7q img",
		title: "._3OKyci",
		price: "._2TxNQv",
		color: "#09E524",
	});

const getFromArabam = (url) =>
	scrapeWebsite(url, {
		image: ".swiper-wrapper .swiper-lazy.swiper-main-img.swiper-lazy-loaded",
		title: ".product-name-container",
		price: ".product-price",
		color: "#F9011B",
	});

module.exports = {
	getFromSahibinden,
	getFromLetgo,
	getFromHepsiEmlak,
	getFromEmlakJet,
	getFromArabam,
};
