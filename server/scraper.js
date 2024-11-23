const { connect } = require("puppeteer-real-browser");

const getThumbnailFromSahibinden = async (url) => {
	let browser = null;
	let page = null;
	try {
		const { browser: connectedBrowser, page: connectedPage } = await connect({
			headless: false,
			args: [],
			customConfig: {},
			turnstile: true,
			connectOption: {},
			disableXvfb: false,
			ignoreAllFlags: false,
		});
		browser = connectedBrowser;
		page = connectedPage;

		await page.setViewport({ width: 1024, height: 768 });
		await page.setExtraHTTPHeaders({
			"accept-language": "en-US,en;q=0.9",
		});
		await page.goto(url);
		const image = await page.waitForSelector(".stdImg");
		const src = await image.evaluate((img) => img.src);
		// console.log("Image src:", src);
		const price = await page.waitForSelector(".classified-price-wrapper");
		const value = await price.evaluate((price) => price.textContent.trim());
		return { src, value };
	} catch (error) {
		// console.error("Error fetching thumbnail:", error);
		throw error; // Re-throw the error to propagate it to the calling function
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
	let browser = null;
	let page = null;
	try {
		const { browser: connectedBrowser, page: connectedPage } = await connect({
			headless: false,
			args: [],
			customConfig: {},
			turnstile: true,
			connectOption: {},
			disableXvfb: false,
			ignoreAllFlags: false,
		});
		browser = connectedBrowser;
		page = connectedPage;

		await page.setViewport({ width: 1024, height: 768 });
		await page.setExtraHTTPHeaders({
			"accept-language": "en-US,en;q=0.9",
		});
		await page.goto(url);
		const image = await page.waitForSelector(".stdImg");
		const src = await image.evaluate((img) => img.src);
		// console.log("Image src:", src);

		return src;
	} catch (error) {
		// console.error("Error fetching thumbnail:", error);
		throw error; // Re-throw the error to propagate it to the calling function
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
};
