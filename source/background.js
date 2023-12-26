// chrome.runtime.onInstalled.addListener(() => {
//     chrome.action.setBadgeText({
//         text: "ON",
//     });
// });

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (tab.url) {
        const url = new URL(tab.url);
        if (url.hostname === 'app.cheminventory.net') {
            chrome.action.setBadgeText({ text: 'ON', tabId: tabId });
            chrome.action.setBadgeBackgroundColor({ color: [0, 0, 0, 0], tabId: tabId }); // Set color to black

            chrome.action.setIcon({ path: 'logo.png', tabId: tabId }); // Set to disabled icon
        } else {

            chrome.action.setBadgeBackgroundColor({ color: [128, 128, 128, 0], tabId: tabId }); // Set color to gray
            chrome.action.setBadgeText({ text: '', tabId: tabId });

            chrome.action.setIcon({ path: 'logo_disabled.png', tabId: tabId }); // Set to disabled icon
        }
    }
});

// Function to make API call
function makeApiCall(token) {
    const url = 'https://app.cheminventory.net/api/order/load';
    const data = {
        "scope": "inventory",
        "jwt": token
    };

    return fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
        .then(response => response.json())
        .catch(error => console.error('Error:', error));
}


chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    switch (request.action) {
        case "makeApiCall":
            makeApiCall(request.jwtToken).then((response) => {
                sendResponse(response)
                return true
            }).catch((error) => {
                console.error(error);
                return false
            })
    }
    return true
})