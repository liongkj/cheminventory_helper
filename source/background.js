chrome.runtime.onInstalled.addListener(() => {
    chrome.action.setBadgeText({
        text: "ON",
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