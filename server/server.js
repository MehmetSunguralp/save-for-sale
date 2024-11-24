const express = require("express");
const { getFromSahibinden, getFromLetgo, getFromHepsiEmlak, getFromEmlakJet, getFromArabam } = require("./scraper");

const app = express();
const port = 3000;

app.use(express.json());

app.post("/thumbnail", async (req, res) => {
	try {
		const { url } = req.body;

		if (!url || url.length === 0) {
			return res.status(400).json({ success: false, message: "URL is required" });
		}

		const domainMatch = url.match(/^https?:\/\/(www\.)?([^\/]+)/);
		if (!domainMatch) {
			return res.status(400).json({ success: false, message: "Invalid URL format" });
		}

		const domain = domainMatch[2];

		let advertisementSrc;

		if (domain === "sahibinden.com") {
			advertisementSrc = await getFromSahibinden(url);
		} else if (domain === "letgo.com") {
			advertisementSrc = await getFromLetgo(url);
		} else if (domain === "hepsiemlak.com") {
			advertisementSrc = await getFromHepsiEmlak(url);
		} else if (domain === "emlakjet.com") {
			advertisementSrc = await getFromEmlakJet(url);
		} else if (domain === "arabam.com") {
			advertisementSrc = await getFromArabam(url);
		} else {
			return res.status(400).json({
				success: false,
				message: `No scraper available for the domain: ${domain}`,
			});
		}
		res
			.status(200)
			.json({ success: true, src: advertisementSrc.src, title: advertisementSrc.title, price: advertisementSrc.value });
	} catch (error) {
		console.error("Error fetching thumbnail:", error);
		res.status(500).json({ success: false, message: "Failed to fetch thumbnail", error });
	}
});

app.listen(port, () => {
	console.log(`Server running on http://localhost:${port}`);
});
