const express = require("express");
const { getThumbnailFromSahibinden, getThumbnailFromLetgo } = require("./scraper"); // Sahibinden scraper
// const { getThumbnailFromLetgo } = require("./letgoScraper"); // Letgo scraper (example)

const app = express();
const port = 3000;

app.use(express.json());

app.post("/thumbnail", async (req, res) => {
	try {
		const { url } = req.body;

		// Check if URL is provided
		if (!url || url.length === 0) {
			return res.status(400).json({ success: false, message: "URL is required" });
		}

		// Extract the domain from the URL
		const domainMatch = url.match(/^https?:\/\/(www\.)?([^\/]+)/);
		if (!domainMatch) {
			return res.status(400).json({ success: false, message: "Invalid URL format" });
		}

		const domain = domainMatch[2]; // Extracted domain (e.g., sahibinden.com, letgo.com)

		let thumbnailSrc;

		// Check the domain and trigger the corresponding scraper function
		if (domain === "sahibinden.com") {
			thumbnailSrc = await getThumbnailFromSahibinden(url);
		} else if (domain === "letgo.com") {
			thumbnailSrc = await getThumbnailFromLetgo(url);
		} else {
			// Default response for unsupported domains
			return res.status(400).json({
				success: false,
				message: `No scraper available for the domain: ${domain}`,
			});
		}

		// Send the response
		res.status(200).json({ success: true, src: thumbnailSrc.src, price: thumbnailSrc.value });
	} catch (error) {
		console.error("Error fetching thumbnail:", error);
		res.status(500).json({ success: false, message: "Failed to fetch thumbnail", error });
	}
});

// Start the server
app.listen(port, () => {
	console.log(`Server running on http://localhost:${port}`);
});
