import { useState } from "react";
import { MagnifyingGlass } from "react-loader-spinner";
import { createAd } from "../../utils/api";
import mainLogo from "/main-logo.png";
import addIcon from "/add.svg";
import refreshIcon from "/refresh.svg";
import searchIcon from "/search.svg";
import "./AdWrapper.css";

import { AdItem } from "../AdItem/AdItem";
const currentDomainPath =
	"https://www.sahibinden.com/ilan/emlak-konut-kiralik-tasyaka-mah-cadde-uzerinde-full-esyali-kiralik-cati-dublex-daire-1213713171/detay";
export const AdWrapper = ({ list }) => {
	const [isLoading, setIsLoading] = useState(false); // Genel yüklenme durumu
	const [loadingMessage, setLoadingMessage] = useState(""); // İlerleme mesajı
	const [isRefreshing, setIsRefreshing] = useState(false); // Yenileme durumu
	const [adListing, setAdListing] = useState(list || []); // İlan listesi
	const [searchQuery, setSearchQuery] = useState(""); // Arama sorgusu

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
				setAdListing(JSON.parse(localStorage.getItem("adList")) || []); // Default to an empty array if null
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
			setIsRefreshing(true);
			setLoadingMessage(""); // Başlangıçta mesajı temizle

			const existingList = JSON.parse(localStorage.getItem("adList")) || [];
			const updatedList = [];

			for (const [index, ad] of existingList.entries()) {
				// İlerleme mesajını ayarla
				setLoadingMessage(`Yenileniyor ${index + 1}/${existingList.length}`);

				const refreshedAd = await createAd(ad.url); // Her ilanı yenile
				if (refreshedAd) {
					updatedList.push(refreshedAd);
				} else {
					console.warn("Failed to refresh ad:", ad.url);
				}
			}

			// Yenilenen listeyi güncelle
			localStorage.setItem("adList", JSON.stringify(updatedList));
			setAdListing(updatedList);
		} catch (error) {
			console.error("Error refreshing ads:", error.message);
		} finally {
			setIsRefreshing(false);
			setLoadingMessage(""); // İşlem bitince mesajı temizle
		}
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

				<button className="add-btn" onClick={handleDomain} disabled={isLoading || isRefreshing}>
					{isLoading ? (
						"Yükleniyor..."
					) : (
						<span>
							İlan Ekle
							<img src={addIcon} alt="add-icon" />
						</span>
					)}
				</button>

				<button className="refresh-btn" onClick={handleRefreshAll} disabled={isRefreshing}>
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
					adListing.reverse().map((ad, index) => <AdItem key={index} listingData={ad} onDelete={handleDelete} />)
				) : (
					<p className="no-ad-warning">Henüz eklenmiş ilan yok.</p>
				)}
			</div>
		</div>
	);
};
