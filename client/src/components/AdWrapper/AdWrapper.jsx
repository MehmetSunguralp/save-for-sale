import { useState } from "react";
import { MagnifyingGlass } from "react-loader-spinner";
import { handleDomain, handleDelete, handleRefreshAll } from "../../utils/handlers";
import mainLogo from "/main-logo.png";
import addIcon from "/add.svg";
import refreshIcon from "/refresh.svg";
import searchIcon from "/search.svg";
import "./AdWrapper.css";

import { AdItem } from "../AdItem/AdItem";

const currentDomainPath =
	"https://www.sahibinden.com/ilan/emlak-konut-kiralik-tasyaka-mah-cadde-uzerinde-full-esyali-kiralik-cati-dublex-daire-1213713171/detay";

export const AdWrapper = ({ list }) => {
	const [isLoading, setIsLoading] = useState(false); // General loading state
	const [loadingMessage, setLoadingMessage] = useState(""); // Progress message
	const [isRefreshing, setIsRefreshing] = useState(false); // Refresh state
	const [adListing, setAdListing] = useState(list || []); // Ad list
	const [searchQuery, setSearchQuery] = useState(""); // Search query

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

				<button
					className="add-btn"
					onClick={() => handleDomain(currentDomainPath, setIsLoading, setAdListing)}
					disabled={isLoading || isRefreshing}
				>
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
				) : adListing.length > 0 ? (
					adListing
						.reverse()
						.map((ad, index) => (
							<AdItem key={index} listingData={ad} onDelete={(url) => handleDelete(url, adListing, setAdListing)} />
						))
				) : (
					<p className="no-ad-warning">Henüz eklenmiş ilan yok.</p>
				)}
			</div>
		</div>
	);
};
