import "./AdItem.css";
export const AdItem = ({ listingData }) => {
	console.log(listingData);
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
		</a>
	);
};
