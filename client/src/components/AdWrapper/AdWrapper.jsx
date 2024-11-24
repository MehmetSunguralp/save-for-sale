import { useEffect } from "react";
import { createAd } from "../../utils/api";
import "./AdWrapper.css";

import React from "react";

export const AdWrapper = () => {
	useEffect(() => {
		createAd("https://www.sahibinden.com/ilan/ozel-ders-verenler-yabanci-dil-almanca-dersi-1153549516/detay/");
	}, []);
	return <div>AdWrapper</div>;
};
