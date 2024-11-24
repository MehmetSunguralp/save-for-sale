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
		console.error(error);
	}
};
