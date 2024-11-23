const { connect } = require("puppeteer-real-browser");

let browser = null;
let page = null;

const connectOptions = {
	headless: false,
	args: [],
	customConfig: {},
	turnstile: true,
	connectOption: {},
	disableXvfb: false,
	ignoreAllFlags: false,
};

const viewPortOptions = { width: 1024, height: 768 };
const ExtraHTTPHeadersOptions = { "accept-language": "en-US,en;q=0.9" };

const getThumbnailFromSahibinden = async (url) => {
	try {
		const { browser: connectedBrowser, page: connectedPage } = await connect(connectOptions);
		browser = connectedBrowser;
		page = connectedPage;

		await page.setViewport(viewPortOptions);
		await page.setExtraHTTPHeaders(ExtraHTTPHeadersOptions);
		await page.goto(url);
		const image = await page.waitForSelector(".stdImg");
		const src = await image.evaluate((img) => img.src);
		const price = await page.waitForSelector(".classified-price-wrapper");
		const value = await price.evaluate((price) => price.textContent.trim());
		return { src, value };
	} catch (error) {
		throw error;
	} finally {
		if (page) {
			await page.close();
		}
		if (browser) {
			await browser.close();
		}
	}
};

const getThumbnailFromLetgo = async (url) => {
	try {
		const { browser: connectedBrowser, page: connectedPage } = await connect(connectOptions);
		browser = connectedBrowser;
		page = connectedPage;

		await page.setViewport(viewPortOptions);
		await page.setExtraHTTPHeaders(ExtraHTTPHeadersOptions);
		await page.goto(url);
		const imageContainer = await page.waitForSelector(".img-container");
		const src = await imageContainer.evaluate((container) => {
			const img = container.querySelector("img");
			return img.src;
		});
		const priceContainer = await page.waitForSelector(".summary-upper");
		const value = await priceContainer.evaluate((container) => {
			const img = container.querySelector("h2");
			return img.textContent.trim();
		});

		return { src, value };
	} catch (error) {
		throw error;
	} finally {
		if (page) {
			await page.close();
		}
		if (browser) {
			await browser.close();
		}
	}
};

module.exports = {
	getThumbnailFromSahibinden,
	getThumbnailFromLetgo,
};
