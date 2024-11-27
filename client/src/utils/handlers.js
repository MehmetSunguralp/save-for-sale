import { createAd } from "./api";

export const handleDomain = (currentDomainPath, setIsLoading, setAdListing) => {
	let isInstanceOf = false;
	const existingList = JSON.parse(localStorage.getItem("adList"));

	if (existingList) {
		existingList.some((ad) => {
			if (ad.url === currentDomainPath) {
				isInstanceOf = true;
				return true;
			}
		});
	}

	if (isInstanceOf) {
		alert("İlan zaten listede bulunuyor: " + currentDomainPath);
	} else if (
		currentDomainPath.includes("https://www.sahibinden.com/ilan") ||
		currentDomainPath.includes("https://www.emlakjet.com/ilan") ||
		currentDomainPath.includes("https://www.hepsiemlak.com") ||
		currentDomainPath.includes("https://www.arabam.com/ilan") ||
		(currentDomainPath.includes("https://www.letgo.com/item") && isInstanceOf === false)
	) {
		setIsLoading(true);
		createAd(currentDomainPath).finally(() => {
			setIsLoading(false);
			setAdListing(JSON.parse(localStorage.getItem("adList")) || []); // Default to an empty array if null
		});
	} else {
		setIsLoading(false);
		alert("Geçersiz link!");
	}
};

export const handleDelete = (url, adListing, setAdListing) => {
	const updatedList = adListing.filter((ad) => ad.url !== url);
	localStorage.setItem("adList", JSON.stringify(updatedList)); // Update localStorage
	setAdListing(updatedList); // Update state
};

export const handleRefreshAll = async (setIsRefreshing, setLoadingMessage, setAdListing) => {
	try {
		setIsRefreshing(true);
		setLoadingMessage(""); // Clear initial message

		const existingList = JSON.parse(localStorage.getItem("adList")) || [];
		const updatedList = [];

		for (const [index, ad] of existingList.entries()) {
			// Set progress message
			setLoadingMessage(`Yenileniyor ${index + 1}/${existingList.length}`);

			const refreshedAd = await createAd(ad.url); // Refresh each ad
			if (refreshedAd) {
				updatedList.push(refreshedAd);
			} else {
				console.warn("İlan güncellenemedi:", ad.url);
			}
		}

		// Update the refreshed list
		localStorage.setItem("adList", JSON.stringify(updatedList));
		setAdListing(updatedList);
	} catch (error) {
		console.error("Güncelle sırasında sorun oluştu:", error.message);
	} finally {
		setIsRefreshing(false);
		setLoadingMessage(""); // Clear message after the process
	}
};
