import { useState } from "react";
import { MagnifyingGlass } from "react-loader-spinner";
import { handleDomain, handleDelete, handleRefreshAll } from "../../utils/handlers";
import mainLogo from "/main-logo.png";
import addIcon from "/add.svg";
import refreshIcon from "/refresh.svg";
import searchIcon from "/search.svg";
import "./AdWrapper.css";

import { AdItem } from "../AdItem/AdItem";

export const AdWrapper = ({ list }) => {
	const [isLoading, setIsLoading] = useState(false);
	const [loadingMessage, setLoadingMessage] = useState("");
	const [isRefreshing, setIsRefreshing] = useState(false);
	const [adListing, setAdListing] = useState(list || []);
	const [searchQuery, setSearchQuery] = useState("");
	const filteredAds = adListing.filter((ad) => ad.title.toLowerCase().includes(searchQuery.toLowerCase()));

	const addAdvertisement = () => {
		chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
			const tabUrl = tabs[0].url;
			handleDomain(tabUrl, setIsLoading, setAdListing);
		});
	};
	return (
		<div>
			<div className="header">
				<div className="search-wrapper">
					<img src={searchIcon} alt="search-icon" className="search-icon" />
					<input
						type="text"
						placeholder="İlan ara..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="search-input"
					/>
				</div>

				<button className="add-btn" onClick={addAdvertisement} disabled={isLoading || isRefreshing}>
					{isLoading ? (
						"Yükleniyor..."
					) : (
						<span>
							İlan Ekle
							<img src={addIcon} alt="add-icon" />
						</span>
					)}
				</button>

				<button
					className="refresh-btn"
					onClick={() => handleRefreshAll(setIsRefreshing, setLoadingMessage, setAdListing)}
					disabled={isRefreshing}
				>
					{isRefreshing ? (
						<span>{loadingMessage || "Yenileniyor..."}</span>
					) : (
						<span>
							Yenile
							<img src={refreshIcon} alt="refresh-icon" />
						</span>
					)}
				</button>
			</div>

			<div className="ad-list-wrapper">
				{isRefreshing ? (
					<MagnifyingGlass
						visible={true}
						height="200"
						width="200"
						ariaLabel="magnifying-glass-loading"
						wrapperStyle={{}}
						wrapperClass="magnifying-glass-wrapper"
						glassColor="#f0ebd8"
						color="#979797"
					/>
				) : isLoading ? (
					<MagnifyingGlass
						visible={true}
						height="200"
						width="200"
						ariaLabel="magnifying-glass-loading"
						wrapperStyle={{}}
						wrapperClass="magnifying-glass-wrapper"
						glassColor="#f0ebd8"
						color="#979797"
					/>
				) : filteredAds.length > 0 ? (
					filteredAds.reverse().map((listingData, index) => {
						return (
							<AdItem
								key={index}
								listingData={listingData}
								onDelete={(adUrl) => handleDelete(adUrl, setAdListing)} // Pass adUrl and setAdListing
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
