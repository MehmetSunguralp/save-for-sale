import axios from "axios";

export const createAd = async (url) => {
	try {
		axios
			.post("http://localhost:3000/thumbnail", {
				url: url,
			})
			.then((response) => console.log(response.data));
	} catch (error) {
		console.error(error);
	}
};
