window.onload = function () {
    document.getElementById('open').addEventListener('click', function() {
        sendMessage({action: 'open'})
    })
    document.getElementById('close').addEventListener('click', function() {
        sendMessage({action: 'close'})
    });
    function sendMessage (data) {
        chrome.tabs.getSelected(null, function(tab) {
            chrome.tabs.sendRequest(tab.id, data, function(response) {});
        });
    }
}