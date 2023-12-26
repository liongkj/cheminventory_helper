chrome.runtime.onInstalled.addListener(() => {
    chrome.action.setBadgeText({
        text: "ON",
    });
});

// chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
//     if (changeInfo.url) {
//         console.log(changeInfo.url)
//         const url = new URL(changeInfo.url);
//         if (url.hostname === 'app.cheminventory.net') {
//             chrome.action.setBadgeText({ text: 'ON', tabId: tabId });
//         } else {
//             chrome.action.setBadgeText({ text: '', tabId: tabId });
//         }
//     }
// });

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