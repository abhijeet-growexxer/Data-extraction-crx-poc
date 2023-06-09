let tabDetails = {}
chrome.runtime.onInstalled.addListener((details) => {
	if (details.reason == "install") {
		console.log("This is a first install!");
	} else if (details.reason == "update") {
		var thisVersion = chrome.runtime.getManifest().version;
		console.log(
		"Updated from " + details.previousVersion + " to " + thisVersion + "!"
		);
	}
});

chrome.action.onClicked.addListener(async() => {
	const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
	chrome.windows.create({
		tabId: tab.id,
		url: "popup.html",
		width: 500,
		height: 800,
		type: 'popup',
		left: 500,
		top: 30
	});

	tabDetails = tab;
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	if (request.message === 'tabDetails') {
		sendResponse({ tab: tabDetails });  
	}
	return true
})
