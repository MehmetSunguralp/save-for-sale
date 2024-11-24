import { useEffect } from "react";
import { createAd, refreshAds } from "../../utils/api";
import "./AdWrapper.css";

import React from "react";
import { AdItem } from "../AdItem/AdItem";

export const AdWrapper = ({ list }) => {
	const currentDomainPath = window.location.href;

	const handleDomain = () => {
		createAd(currentDomainPath);
	};
	if (list) {
		return (
			<div>
				<div className="header">
					<label className="main-title">Save-For-Sale</label>
					<button className="add-btn" onClick={refreshAds}>
						Yenile
					</button>
				</div>
				<div className="ad-list-wrapper">
					{list.reverse().map((listingData, index) => {
						return <AdItem listingData={listingData} key={index} />;
					})}
				</div>
			</div>
		);
	}
};
