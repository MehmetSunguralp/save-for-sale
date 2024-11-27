import { useState } from "react";
import { Audio } from "react-loader-spinner";
import { createAd } from "../../utils/api";
import mainLogo from "/main-logo.png";
import addIcon from "/add.svg";
import refreshIcon from "/refresh.svg";
import "./AdWrapper.css";

import { AdItem } from "../AdItem/AdItem";

export const AdWrapper = ({ list }) => {
	const [isLoading, setIsLoading] = useState(false);
	const [isRefreshing, setIsRefreshing] = useState(false);
	const [adListing, setAdListing] = useState(list);
	const [searchQuery, setSearchQuery] = useState(""); // State to track search input

	const currentDomainPath =
		"https://www.sahibinden.com/ilan/emlak-konut-kiralik-tasyaka-mah-cadde-uzerinde-full-esyali-kiralik-cati-dublex-daire-1213713171/detay";

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
	const handleDelete = (url) => {
		const updatedList = adListing.filter((ad) => ad.url !== url);
		localStorage.setItem("adList", JSON.stringify(updatedList)); // Update localStorage
		setAdListing(updatedList); // Update state
	};
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

	// Filter the ad listing based on the search query
	const filteredAds = adListing.filter((ad) => ad.title.toLowerCase().includes(searchQuery.toLowerCase()));

	return (
		<div>
			<div className="header">
				{/* 		<img src={mainLogo} alt="main-logo" className="main-logo" /> */}
				<div className="search-wrapper">
					<input
						type="text"
						placeholder="İlan ara..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)} // Update search query on input change
						className="search-input"
					/>
				</div>

				<button className="add-btn" onClick={handleDomain} disabled={isLoading || isRefreshing}>
					{isLoading ? (
						"Yükleniyor..."
					) : (
						<span>
							İlan Ekle
							<img src={addIcon} />
						</span>
					)}
				</button>
				<button className="refresh-btn" onClick={handleRefreshAll} disabled={isLoading}>
					{isLoading ? (
						`Yenileniyor ${isLoading}`
					) : (
						<span>
							Yenile
							<img src={refreshIcon} />
						</span>
					)}
				</button>
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
				) : filteredAds.length > 0 ? ( // Show filtered ad listings if not loading or refreshing
					filteredAds.reverse().map((listingData, index) => {
						return (
							<AdItem
								key={index}
								listingData={listingData}
								onDelete={handleDelete} // Pass handleDelete as a prop
							/>
						);
					})
				) : (
					<p className="no-ad-warning">
						{adListing.length === 0 ? "İlan eklemek için İlan Ekle butonuna tıklayınız." : "No ads match your search."}
					</p>
				)}
			</div>
		</div>
	);
};
