const express = require("express");
const cors = require("cors");
const { getFromSahibinden, getFromLetgo, getFromHepsiEmlak, getFromEmlakJet, getFromArabam } = require("./scraper");

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());
app.post("/thumbnail", async (req, res) => {
	try {
		const { url } = req.body;
		console.log("Received URL:", url);

		if (!url || url.length === 0) {
			console.error("URL is missing");
			return res.status(400).json({ success: false, message: "URL is required" });
		}

		const domainMatch = url.match(/^https?:\/\/(www\.)?([^\/]+)/);
		if (!domainMatch) {
			console.error("Invalid URL format");
			return res.status(400).json({ success: false, message: "Invalid URL format" });
		}

		const domain = domainMatch[2];
		console.log("Domain:", domain);

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
			console.error("Invalid domain:", domain);
			return res.status(400).json({
				success: false,
				message: `Invalid domain: ${domain}`,
			});
		}

		console.log("Scraping result:", advertisementSrc);

		res.status(200).json({
			success: true,
			src: advertisementSrc.src,
			title: advertisementSrc.title,
			price: advertisementSrc.value,
			color: advertisementSrc.color,
			url: advertisementSrc.url,
		});
	} catch (error) {
		console.error("Error in /thumbnail:", error); // Log full error
		res.status(500).json({ success: false, message: "Failed to fetch thumbnail", error: error.message });
	}
});

app.listen(port, () => {
	console.log(`Server running on http://localhost:${port}`);
});
