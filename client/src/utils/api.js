import axios from "axios";
export const createAd = async (url) => {
	try {
		const response = await axios.post("http://localhost:3000/thumbnail", { url });
		console.log("API Response:", response.data);

		const newAd = response.data; // Extract the new ad data

		// Update localStorage
		if (localStorage.getItem("adList")) {
			const existingList = JSON.parse(localStorage.getItem("adList"));
			existingList.push(newAd);
			localStorage.setItem("adList", JSON.stringify(existingList));
		} else {
			localStorage.setItem("adList", JSON.stringify([newAd]));
		}

		return newAd; // Explicitly return the new ad data
	} catch (error) {
		// Handle error
		const errorMessage = error.response?.data?.message || "An error occurred";
		alert(errorMessage);
		console.error("Error in createAd:", errorMessage);
		return null; // Explicitly return null on failure
	}
};
