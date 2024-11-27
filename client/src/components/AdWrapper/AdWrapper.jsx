import { createAd } from "../../utils/api";
import { Audio } from "react-loader-spinner";
import mainLogo from "/main-logo.png";
import "./AdWrapper.css";

import { useState } from "react";
import { AdItem } from "../AdItem/AdItem";

export const AdWrapper = ({ list }) => {
	const [isLoading, setIsLoading] = useState(false);
	const [isRefreshing, setIsRefreshing] = useState(false);
	const [adListing, setAdListing] = useState(list);

	const currentDomainPath = "https://www.letgo.com/item/bugaboo-bee-bebek-arabas-iid-1694381927";

	const handleDomain = () => {
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
			alert("URL already exists: " + currentDomainPath);
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
				setAdListing(JSON.parse(localStorage.getItem("adList")));
			});
		} else {
			setIsLoading(false);
			alert("Invalid domain!");
		}
	};

	// const handleRefreshAll = async () => {
	// 	const existingList = JSON.parse(localStorage.getItem("adList"));
	// 	if (!existingList || existingList.length === 0) {
	// 		alert("No ads to refresh.");
	// 		return;
	// 	}

	// 	setIsRefreshing(true);
	// 	const refreshedAds = [];
	// 	//localStorage.removeItem("adList");
	// 	for (const ad of existingList) {
	// 		try {
	// 			// Refresh ad by calling createAd with the ad's URL

	// 			const refreshedAd = await createAd(ad.url)
	// 			refreshedAds.push(refreshedAd);
	// 			//console.log(refreshedAds);
	// 		} catch (error) {
	// 			console.error(`Failed to refresh ad with URL ${ad.url}:`, error);
	// 			// Optionally push the old ad if the refresh fails
	// 			refreshedAds.push(ad);
	// 		}
	// 	}

	// 	// Update localStorage and state with refreshed ads
	// 	localStorage.setItem("adList", JSON.stringify(refreshedAds));
	// 	setAdListing(refreshedAds);
	// 	setIsRefreshing(false);
	// };
	const handleRefreshAll = async () => {
		try {
			const existingList = JSON.parse(localStorage.getItem("adList")) || [];
			const updatedList = [];
			let currentProgress = 0; // To track the current item

			for (const [index, ad] of existingList.entries()) {
				currentProgress = index + 1; // Update progress
				setIsLoading(`${currentProgress}/${existingList.length}`); // Show progress as "1/4", "2/4", etc.

				const refreshedAd = await createAd(ad.url); // Call createAd for each URL
				if (refreshedAd) {
					updatedList.push(refreshedAd);
				} else {
					console.warn("Failed to refresh ad:", ad.url);
				}
			}

			// Update localStorage with the refreshed list
			localStorage.setItem("adList", JSON.stringify(updatedList));
			setAdListing(updatedList); // Update state
			setIsLoading(false); // Stop showing the progress
		} catch (error) {
			console.error("Error refreshing ads:", error.message);
			setIsLoading(false); // Stop loading in case of error
		}
	};

	return (
		<div>
			<div className="header">
				<img src={mainLogo} alt="main-logo" className="main-logo" />
				<div>
					<button className="add-btn" onClick={handleDomain} disabled={isLoading || isRefreshing}>
						{isLoading ? "Yükleniyor..." : "İlan Ekle"}
					</button>
					<button className="refresh-btn" onClick={handleRefreshAll} disabled={isLoading}>
						{isLoading ? `Refreshing ${isLoading}` : "Refresh All"}
					</button>
				</div>
			</div>
			<div className="ad-list-wrapper">
				{isLoading || isRefreshing ? ( // Show loader when loading or refreshing
					<Audio
						height="100"
						width="100"
						color="#4fa94d"
						ariaLabel="loading-spinner"
						wrapperStyle={{}}
						wrapperClass="loader-wrapper"
					/>
				) : adListing ? ( // Show ad listings if not loading or refreshing
					adListing.reverse().map((listingData, index) => {
						return <AdItem listingData={listingData} key={index} />;
					})
				) : (
					<p className="no-ad-warning">
						İlan eklemek için <span>İlan Ekle</span> butonuna tıklayınız.
					</p>
				)}
			</div>
		</div>
	);
};
