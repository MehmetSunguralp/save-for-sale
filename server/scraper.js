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

const getFromSahibinden = async (url) => {
	try {
		const { browser: connectedBrowser, page: connectedPage } = await connect(connectOptions);
		browser = connectedBrowser;
		page = connectedPage;

		await page.setViewport(viewPortOptions);
		await page.setExtraHTTPHeaders(ExtraHTTPHeadersOptions);
		await page.goto(url);
		//Gets image
		const image = await page.waitForSelector(".stdImg");
		const src = await image.evaluate((img) => img.src);
		//Gets title
		const titleContainer = await page.waitForSelector(".classifiedDetailTitle");
		const title = await titleContainer.evaluate((container) => {
			const query = container.querySelector("h1");
			return query.textContent.trim().toLowerCase();
		});
		//Gets price
		const price = await page.waitForSelector(".classified-price-wrapper");
		const value = await price.evaluate((price) => price.textContent.trim());
		return { src, value, title };
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

const getFromLetgo = async (url) => {
	try {
		const { browser: connectedBrowser, page: connectedPage } = await connect(connectOptions);
		browser = connectedBrowser;
		page = connectedPage;

		await page.setViewport(viewPortOptions);
		await page.setExtraHTTPHeaders(ExtraHTTPHeadersOptions);
		await page.goto(url);
		//Gets image
		const imageContainer = await page.waitForSelector(".img-container");
		const src = await imageContainer.evaluate((container) => {
			const img = container.querySelector("img");
			return img.src;
		});
		//Gets price
		const titleContent = await page.waitForSelector(".ad-name");
		const title = await titleContent.evaluate((price) => price.textContent.trim().toLowerCase());

		//Gets price
		const priceContainer = await page.waitForSelector(".summary-upper");
		const value = await priceContainer.evaluate((container) => {
			const img = container.querySelector("h2");
			return img.textContent.trim();
		});

		return { src, value, title };
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
const getFromHepsiEmlak = async (url) => {
	try {
		const { browser: connectedBrowser, page: connectedPage } = await connect(connectOptions);
		browser = connectedBrowser;
		page = connectedPage;

		await page.setViewport(viewPortOptions);
		await page.setExtraHTTPHeaders(ExtraHTTPHeadersOptions);
		await page.goto(url);
		//Gets image
		const imageContainer = await page.waitForSelector(".img-wrapper");
		const src = await imageContainer.evaluate((container) => {
			const img = container.querySelector("img");
			return img.src;
		});
		//Gets title
		const titleContainer = await page.waitForSelector(".det-title-upper");
		const title = await titleContainer.evaluate((container) => {
			const query = container.querySelector("h1");
			return query.textContent.trim().toLowerCase();
		});
		//Gets price
		const price = await page.waitForSelector(".fz24-text.price");
		const value = await price.evaluate((price) => price.textContent.trim());
		return { src, value, title };
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
const getFromEmlakJet = async (url) => {
	try {
		const { browser: connectedBrowser, page: connectedPage } = await connect(connectOptions);
		browser = connectedBrowser;
		page = connectedPage;

		await page.setViewport(viewPortOptions);
		await page.setExtraHTTPHeaders(ExtraHTTPHeadersOptions);
		await page.goto(url);
		//Gets image
		const imageContainer = await page.waitForSelector("._1L9i7q");
		const src = await imageContainer.evaluate((container) => {
			const img = container.querySelector("img");
			return img.src;
		});
		//Gets title
		const titleContent = await page.waitForSelector("._3OKyci");
		const title = await titleContent.evaluate((price) => price.textContent.trim().toLowerCase());
		//Gets price
		const price = await page.waitForSelector("._2TxNQv");
		const value = await price.evaluate((price) => price.textContent.trim());
		return { src, value, title };
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
	getFromSahibinden,
	getFromLetgo,
	getFromHepsiEmlak,
	getFromEmlakJet,
};
