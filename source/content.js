// Content Script - content.js

// Fetch JWT token from local storage

function fetchToken() {
    return new Promise((resolve, reject) => {
        const token = localStorage.getItem("jwt")

        if (token) {
            resolve(token);
        } else {
            reject("JWT token not found in local storage");
        }
    })
}
function downloadCsv() {

    fetchToken().then((token) => {
        chrome.runtime.sendMessage({ action: "makeApiCall", jwtToken: token }, function (response) {
            // convert to excel and download
            const data = response["data"];
            const headers = Object.keys(data[0]);
            const csv = [
                headers.join(','),
                ...data.map(row => headers.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','))
            ].join('\r\n');

            function replacer(key, value) { return value === null ? '' : value; }

            // UTF-8 BOM
            const BOM = '\uFEFF';
            const csvWithBOM = BOM + csv;

            const blob = new Blob([csvWithBOM], { type: 'text/csv;charset=utf-8;' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.setAttribute('hidden', '');
            a.setAttribute('href', url);
            a.setAttribute('download', 'data.csv');
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            return true;
        })
        return true
    }).catch((error) => {
        console.error(error);
        alert("Error: " + error); // Provide user feedback
    });

}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', afterDOMLoaded);
} else {
    afterDOMLoaded();
}

function afterDOMLoaded() {
    console.log("loaded")
    // (async () => {
    const button = document.createElement('button');
    button.textContent = 'Download all';
    button.className = "btn btn-xs btn-primary pull-right"
    button.addEventListener('click', downloadCsv);
    // sibling button id=btnorderdownload
    const sibling = document.getElementById('btnorderdownload');
    sibling.parentNode.insertBefore(button, sibling);
    // })();
};