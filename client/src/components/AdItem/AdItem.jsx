import sahibinden from "/sahibinden.svg";
import letgo from "/letgo.svg";
import emlakjet from "/emlakjet.svg";
import hepsiemlak from "/hepsiemlak.svg";
import arabam from "/arabam.svg";
import trashLogo from "/trash.svg";

import "./AdItem.css";

export const AdItem = ({ listingData, onDelete }) => {
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
		default:
			logo = null;
	}

	const handleDelete = (e) => {
		e.stopPropagation(); // Prevent event propagation to the parent <a>
		e.preventDefault(); // Prevent navigation triggered by the <a>
		if (window.confirm("İlanı gerçekten silmek istiyor musun?")) {
			onDelete(listingData.url); // Trigger the onDelete callback with the item's URL
		}
	};

	return (
		<a className="ad-item" href={listingData.url} target="_blank" rel="noopener noreferrer">
			<img src={listingData.src} alt="ad-thumbnail" className="thumbnail" />
			<div className="text-content">
				<h2 className="title">{listingData.title}</h2>
				<p className="price">{listingData.price}</p>
			</div>
			<img className="site-logo" src={logo} alt="site-logo" />
			<button className="delete-btn" onClick={handleDelete}>
				<img src={trashLogo} alt="Delete" />
			</button>
		</a>
	);
};
