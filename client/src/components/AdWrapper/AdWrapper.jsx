import { createAd, refreshAds } from "../../utils/api";
import { Audio } from "react-loader-spinner";
import mainLogo from "/main-logo.png";
import "./AdWrapper.css";

import { useState } from "react";
import { AdItem } from "../AdItem/AdItem";

export const AdWrapper = ({ list }) => {
	const [isLoading, setIsLoading] = useState(false);
	const [adListing, setAdListing] = useState(list);

	const currentDomainPath = "https://www.letgo.com/item/renault-symbol-15-dci-touch-2016-iid-1697898856";

	const handleDomain = () => {
		let isInstanceOf = false;
		const existingList = JSON.parse(localStorage.getItem("adList"));
		existingList.some((ad) => {
			if (ad.url === currentDomainPath) {
				isInstanceOf = true;
				return true;
			}
		});
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

	return (
		<div>
			<div className="header">
				<img src={mainLogo} alt="main-logo" className="main-logo" />
				<button className="add-btn" onClick={handleDomain} disabled={isLoading}>
					{isLoading ? "Yükleniyor..." : "İlan Ekle"}
				</button>
			</div>
			<div className="ad-list-wrapper">
				{isLoading ? ( // Show loader when loading
					<Audio
						height="100"
						width="100"
						color="#4fa94d"
						ariaLabel="loading-spinner"
						wrapperStyle={{}}
						wrapperClass="loader-wrapper"
					/>
				) : adListing ? ( // Show ad listings if not loading
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
