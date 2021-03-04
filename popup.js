const background = chrome.extension.getBackgroundPage();

window.onload = function () {
    if (background.getStatus()) {
        changeColor('open', '#1890ff')
        changeColor('close', '#000')
    } else {
        changeColor('close', '#1890ff')
        changeColor('open', '#000')
    }
    document.getElementById('open').addEventListener('click', function() {
        background.setStatus(true);
        changeColor('open', '#1890ff')
        changeColor('close', '#000')
        sendMessage({action: 'open'})
    })
    document.getElementById('close').addEventListener('click', function() {
        background.setStatus(false);
        changeColor('close', '#1890ff')
        changeColor('open', '#000')
        sendMessage({action: 'close'})
    });
    function sendMessage (data) {
        chrome.tabs.getSelected(null, function(tab) {
            chrome.tabs.sendRequest(tab.id, data, function(response) {});
        });
    }
}

function changeColor(status, color) {
    document.getElementById(status).style.color = color;
}
