const antibotbrowser = require("antibotbrowser");
const puppeteer = require("puppeteer");
(async () => {
	const antibrowser = await antibotbrowser.startbrowser(9222); // We start the browser with settings Port: 9222

	const browser = await puppeteer.connect({ browserWSEndpoint: antibrowser.websokcet }); // We connect the launched browser to puppeteer. With the variable we created above, it gives the web socket url to puppetter with antibotbrowser.websocket.

	// Normal use from now on
	const page = await browser.newPage();

	await page.setViewport({ width: 0, height: 0 });

	await page.goto("https://www.sahibinden.com/ilan/ozel-ders-verenler-yabanci-dil-almanca-dersi-1153549516/detay/");
	const image = await page.waitForSelector(".stdImg");
	const src = await image.evaluate((img) => img.src);
    console.log(src)
})();
