import axios from "axios";

export const createAd = async (url) => {
	try {
		const response = await axios.post("http://localhost:3000/thumbnail", { url });
		console.log("API Response:", response.data);

		const newAd = response.data; // Extract the new ad data

		// Update chrome.storage.local
		chrome.storage.local.get({ adList: [] }, (result) => {
			const existingList = result.adList;
			existingList.push(newAd);
			chrome.storage.local.set({ adList: existingList });
		});

		return newAd; // Explicitly return the new ad data
	} catch (error) {
		// Handle error
		const errorMessage = error.response?.data?.message || "An error occurred";
		alert(errorMessage);
		console.error("Error in createAd:", errorMessage);
		throw new Error(errorMessage); // Explicitly throw error on failure
	}
};
