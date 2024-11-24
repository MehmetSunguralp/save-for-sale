import sahibinden from "../../../public/sahibinden.svg";
import letgo from "../../../public/letgo.svg";
import emlakjet from "../../../public/emlakjet.svg";
import hepsiemlak from "../../../public/hepsiemlak.svg";
import arabam from "../../../public/arabam.svg";

import "./AdItem.css";
export const AdItem = ({ listingData }) => {
	let logo;
	switch (listingData.color) {
		case "#FFE800":
			logo = sahibinden;
			break;
		case "#FF3F55":
			logo = letgo;
			break;
		case "#09E524":
			logo = emlakjet;
			break;
		case "#E1251B":
			logo = hepsiemlak;
			break;
		case "#F9011B":
			logo = arabam;
			break;
	}

	return (
		<a
			href={listingData.url}
			target="_blank"
			className="ad-item"
			/* 	style={{ backgroundImage: `linear-gradient(to right, ${listingData.color}, #000)` }} */
		>
			<img src={listingData.src} alt="ad-thumbnail" className="thumbnail" />
			<div className="text-content">
				<h2 className="title">{listingData.title}</h2>
				<p className="price">{listingData.price}</p>
			</div>
			<img className="site-logo" src={logo} alt="site-logo" />
		</a>
	);
};
