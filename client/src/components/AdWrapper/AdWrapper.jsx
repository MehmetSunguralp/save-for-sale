import { createAd, refreshAds } from "../../utils/api";
import "./AdWrapper.css";
import mainLogo from "/main-logo.png";

import React from "react";
import { AdItem } from "../AdItem/AdItem";

export const AdWrapper = ({ list }) => {
	// const currentDomainPath = window.location.href;
	//const currentDomainPath =
	//	"https://www.sahibinden.com/ilan/vasita-arazi-suv-pickup-mercedes-benz-sahibinden-mercedes-gl-1072817282/detay";
	//const currentDomainPath = "https://www.emlakjet.com/ilan/ayrancilar-ege-kent-4de-31-kiralik-daire-cagri-emlaktan-10245254/";
	//const currentDomainPath = "https://www.hepsiemlak.com/ankara-polatli-fatih-kiralik/daire/151732-1";
	//const currentDomainPath = "https://www.arabam.com/ilan/galeriden-satilik-fiat-doblo-combi-1-3-multijet-safeline/2019-model-doblo-combi-1-3-multijet-safeline/26933812";
	const currentDomainPath = "https://www.letgo.com/item/orjinal-110-binde-iid-1697421085";

	const handleDomain = () => {
		let isInstanceOf = false;
		const existingList = JSON.parse(localStorage.getItem("adList"));
		existingList.some((ad) => {
			if (ad.url == currentDomainPath) {
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
			(currentDomainPath.includes("https://www.letgo.com/item") && isInstanceOf == false)
		) {
			createAd(currentDomainPath);
		} else {
			alert("Invalid domain!");
		}
	};

	return (
		<div>
			<div className="header">
				<img src={mainLogo} alt="main-logo" className="main-logo" />
				<button className="add-btn" onClick={handleDomain}>
					İlan Ekle
				</button>
			</div>
			<div className="ad-list-wrapper">
				{list ? (
					list.reverse().map((listingData, index) => {
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
