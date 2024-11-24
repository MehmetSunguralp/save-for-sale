import axios from "axios";

export const createAd = async (url) => {
	try {
		const response = await axios.post("http://localhost:3000/thumbnail", { url });
		console.log(response.data);

		if (localStorage.getItem("adList")) {
			const existingList = JSON.parse(localStorage.getItem("adList"));
			existingList.push(response.data);
			localStorage.setItem("adList", JSON.stringify(existingList));
		} else {
			localStorage.setItem("adList", JSON.stringify([response.data]));
		}
	} catch (error) {
		alert(error.response.data.message);
	}
};

export const refreshAds = async () => {
	try {
		if (localStorage.getItem("adList")) {
			const existingList = JSON.parse(localStorage.getItem("adList"));
			const updatedList = await Promise.all(
				existingList.map(async (ad) => {
					try {
						const response = await axios.post("http://localhost:3000/thumbnail", { url: ad.url });
						return response.data; // Return the updated ad data
					} catch (error) {
						console.error(`Failed to refresh ad: ${ad.url}`, error);
						return ad; // Return the old ad data if refresh fails
					}
				})
			);
			localStorage.setItem("adList", JSON.stringify(updatedList));
			alert("Ads have been refreshed!");
		} else {
			alert("No ads to refresh.");
		}
	} catch (error) {
		console.error("Error refreshing ads:", error);
		alert("Failed to refresh ads.");
	}
};
