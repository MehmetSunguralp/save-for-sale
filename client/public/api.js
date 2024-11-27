// api.js
async function createAd(url) {
	try {
		const response = await axios.post("http://localhost:3000/thumbnail", { url });
		console.log("API Response:", response.data);

		const newAd = response.data; // Extract the new ad data

		return newAd; // Explicitly return the new ad data
	} catch (error) {
		// Handle error
		const errorMessage = error.response?.data?.message || "An error occurred";
		console.error("Error in createAd:", errorMessage);
		throw new Error(errorMessage); // Explicitly throw error on failure
	}
}
