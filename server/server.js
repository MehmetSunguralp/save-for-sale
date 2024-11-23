const express = require("express");
const { getThumbnailFromSahibinden } = require("./scraper"); // Adjust the path accordingly
const app = express();
const port = 3000;

app.use(express.json());

app.post("/thumbnail", async (req, res) => {
	try {
		const { url } = req.body;
		if (!url || url.length == 0) {
			return res.status(400).json({ success: false, message: "URL is required" });
		}

		const thumbnailSrc = await getThumbnailFromSahibinden(url);
		res.status(200).json({ success: true, src: thumbnailSrc });
	} catch (error) {
		console.error("Error fetching thumbnail:", error);
		res.status(500).json({ success: false, message: "Failed to fetch thumbnail", error });
	}
});

// Start the server
app.listen(port, () => {
	console.log(`Server running on http://localhost:${port}`);
});
