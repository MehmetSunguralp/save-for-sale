importScripts("libs/axios.min.js", "api.js");

chrome.runtime.onInstalled.addListener(() => {
	console.log("Extension installed.");
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	if (request.message === "loadAd") {
		const { tabUrl } = request;
		handleDomain(tabUrl, sendResponse);
		return true; // Keep the message channel open for sendResponse
	}
	if (request.message === "refreshAds") {
		handleRefreshAll(sendResponse);
		return true; // Keep the message channel open for sendResponse
	}
});

const handleDomain = (currentDomainPath, sendResponse) => {
	chrome.storage.local.get({ adList: [] }, async (result) => {
		const existingList = result.adList;
		const isInstanceOf = existingList.some((ad) => ad.url === currentDomainPath);

		if (isInstanceOf) {
			sendResponse({ success: false, message: "İlan zaten listede bulunuyor: " + currentDomainPath });
		} else if (
			currentDomainPath.includes("https://www.sahibinden.com/ilan") ||
			currentDomainPath.includes("https://www.emlakjet.com/ilan") ||
			currentDomainPath.includes("https://www.hepsiemlak.com") ||
			currentDomainPath.includes("https://www.arabam.com/ilan") ||
			currentDomainPath.includes("https://www.letgo.com/item")
		) {
			try {
				const newAd = await createAd(currentDomainPath);
				const updatedList = [...existingList, newAd].filter(
					(ad, index, self) => index === self.findIndex((t) => t.url === ad.url)
				);
				chrome.storage.local.set({ adList: updatedList }, () => {
					sendResponse({ success: true, adList: updatedList });
				});
			} catch (error) {
				sendResponse({ success: false, message: "Failed to add ad: " + error.message });
			}
		} else {
			sendResponse({ success: false, message: "Geçersiz link!" + currentDomainPath });
		}
	});
};

const handleRefreshAll = async (sendResponse) => {
	chrome.storage.local.get("adList", async (result) => {
		const existingList = result.adList || [];
		const updatedList = [];

		for (const [index, ad] of existingList.entries()) {
			try {
				// Send progress message for each step, starting from 1
				chrome.runtime.sendMessage({
					message: "refreshProgress",
					progress: `Yenileniyor ${index + 1}/${existingList.length}`,
				});

				const refreshedAd = await createAd(ad.url); // Refresh each ad
				if (refreshedAd) {
					updatedList.push(refreshedAd);
				} else {
					console.warn("İlan güncellenemedi:", ad.url);
				}
			} catch (error) {
				console.error("Güncelle sırasında sorun oluştu:", error.message);
			}
		}

		// Remove duplicates from the updated list
		const uniqueList = updatedList.filter((ad, index, self) => index === self.findIndex((t) => t.url === ad.url));

		// Update the refreshed list
		chrome.storage.local.set({ adList: uniqueList }, () => {
			sendResponse({ success: true, adList: uniqueList });
		});
	});
};
