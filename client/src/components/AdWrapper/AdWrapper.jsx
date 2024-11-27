import { useState, useEffect } from "react";
import { MagnifyingGlass } from "react-loader-spinner";
import mainLogo from "/main-logo.png";
import addIcon from "/add.svg";
import refreshIcon from "/refresh.svg";
import searchIcon from "/search.svg";
import "./AdWrapper.css";
import { AdItem } from "../AdItem/AdItem";

export const AdWrapper = ({ list }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState("");
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [adListing, setAdListing] = useState([]);

    const [searchQuery, setSearchQuery] = useState("");
    const filteredAds = adListing.filter(ad => ad.title.toLowerCase().includes(searchQuery.toLowerCase()));

    useEffect(() => {
        // Fetch the ad list from chrome.storage.local on component mount
        chrome.storage.local.get("adList", result => {
            setAdListing(result.adList || []);
        });

        // Listen for progress updates from the background script
        const messageListener = (message, sender, sendResponse) => {
            if (message.message === "refreshProgress") {
                setLoadingMessage(message.progress);
            }
        };
        chrome.runtime.onMessage.addListener(messageListener);

        // Clean up message listener on component unmount
        return () => {
            chrome.runtime.onMessage.removeListener(messageListener);
        };
    }, []);

    const addAdvertisement = () => {
        setIsLoading(true);
        chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
            const tabUrl = tabs[0].url;
            chrome.runtime.sendMessage({ message: "loadAd", tabUrl: tabUrl }, response => {
                setIsLoading(false);
                if (response && response.success) {
                    setAdListing(response.adList);
                } else {
                    alert(response ? response.message : "Failed to get response from background script.");
                }
            });
        });
    };

    const refreshAdvertisements = () => {
        setIsRefreshing(true);
        chrome.runtime.sendMessage({ message: "refreshAds" }, response => {
            setIsRefreshing(false);
            if (response && response.success) {
                setAdListing(response.adList);
            } else {
                alert(response ? response.message : "Failed to get response from background script.");
            }
            setLoadingMessage(""); // Clear message after the process
        });
    };

    const handleDelete = (adUrl) => {
        if (window.confirm("İlanı gerçekten silmek istiyor musun?")) {
            const updatedList = adListing.filter(ad => ad.url !== adUrl);
            setAdListing(updatedList);
            chrome.storage.local.set({ adList: updatedList });
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

                <button
                    className="add-btn"
                    onClick={addAdvertisement}
                    disabled={isLoading || isRefreshing}
                >
                    {isLoading ? (
                        "Yükleniyor..."
                    ) : (
                        <span>
                            İlan Ekle
                            <img src={addIcon} alt="add-icon" />
                        </span>
                    )}
                </button>

                <button
                    className="refresh-btn"
                    onClick={refreshAdvertisements}
                    disabled={isRefreshing}
                >
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
                ) : filteredAds.length > 0 ? (
                    filteredAds.reverse().map((listingData, index) => (
                        <AdItem
                            key={index}
                            listingData={listingData}
                            onDelete={(adUrl) => handleDelete(adUrl)} // Pass adUrl directly
                        />
                    ))
                ) : (
                    <p className="no-ad-warning">
                        {adListing.length === 0 ? "İlan eklemek için İlan Ekle butonuna tıklayınız." : "No ads match your search."}
                    </p>
                )}
            </div>
        </div>
    );
};
