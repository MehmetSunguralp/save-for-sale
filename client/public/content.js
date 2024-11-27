chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	if (request.message === "getTabUrl") {
		sendResponse({ tabUrl: window.location.href });
	}
});
