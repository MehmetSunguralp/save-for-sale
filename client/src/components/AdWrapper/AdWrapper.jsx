import { useEffect } from "react";
import { createAd } from "../../utils/api";
import "./AdWrapper.css";

import React from "react";

export const AdWrapper = () => {
	useEffect(() => {
		createAd("https://www.hepsiemlak.com/ankara-polatli-mehmet-akif-kiralik/daire/151732-10");
	}, []);
	return <div>AdWrapper</div>;
};
