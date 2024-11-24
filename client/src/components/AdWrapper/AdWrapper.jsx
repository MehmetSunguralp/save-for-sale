import { useEffect } from "react";
import { createAd } from "../../utils/api";
import "./AdWrapper.css";

import React from "react";
import { AdItem } from "../AdItem/AdItem";

export const AdWrapper = ({ list }) => {
	//console.log(list);
	/* useEffect(() => {
		createAd("https://www.hepsiemlak.com/ankara-polatli-mehmet-akif-kiralik/daire/151732-10");
	}, []); */
	if (list) {
		return (
			<div className="ad-list-wrapper">
				{list.reverse().map((listingData, index) => {
					return <AdItem listingData={listingData} key={index} />;
				})}
			</div>
		);
	}
};
