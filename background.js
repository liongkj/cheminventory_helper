chrome.runtime.onInstalled.addListener(() => {
    chrome.action.setBadgeText({
        text: "OFF",
    });
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

chrome.action.onClicked.addListener(async (tab) => {

    // Fetch JWT token from local storage

    chrome.runtime.sendMessage({ action: "fetchToken" }, function (response) {
        console.log(response)
        if (response.jwtToken) {
            console.log("logged in")
            resolve(response.jwtToken);
        } else {
            reject("JWT token not found in local storage");
        }
    })
})


chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    switch (request.action) {
        case "makeApiCall":
            makeApiCall(request.jwtToken).then((response) => {
                console.log(response)
                sendResponse(response)
                return true
            }).catch((error) => {
                console.error(error);
                return false
            })
            return true
    }
})