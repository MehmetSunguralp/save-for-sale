import { useEffect } from "react";
import { createAd, refreshAds } from "../../utils/api";
import "./AdWrapper.css";

import React from "react";
import { AdItem } from "../AdItem/AdItem";

export const AdWrapper = ({ list }) => {
	// const currentDomainPath = window.location.href;
	//const currentDomainPath = "https://www.sahibinden.com/ilan/ozel-ders-verenler-yabanci-dil-almanca-dersi-1153549516/detay/";
	//const currentDomainPath = "https://www.emlakjet.com/ilan/ayrancilar-ege-kent-4de-31-kiralik-daire-cagri-emlaktan-10245254/";
	const currentDomainPath = "https://www.hepsiemlak.com/ankara-polatli-mehmet-akif-kiralik/daire/151732-10";
	//const currentDomainPath = "https://www.arabam.com/ilan/galeriden-satilik-fiat-doblo-combi-1-3-multijet-safeline/2019-model-doblo-combi-1-3-multijet-safeline/26933812";
	//const currentDomainPath = "https://www.letgo.com/item/bugaboo-bee-bebek-arabas-iid-1694381927";

	const handleDomain = () => {
		createAd(currentDomainPath);
	};

	return (
		<div>
			<div className="header">
				<label className="main-title">Save-For-Sale</label>
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
