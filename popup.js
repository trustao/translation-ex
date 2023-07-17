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
    inputTranslate();
    function sendMessage (data) {
        chrome.tabs.getSelected(null, function(tab) {
            chrome.tabs.sendRequest(tab.id, data, function(response) {});
        });
    }
}

function changeColor(status, color) {
    document.getElementById(status).style.color = color;
}

function inputTranslate() {
    let value = ''
    document.getElementById('t-input').addEventListener('change', ev => {
        value = ev.target.value;
    })
    document.getElementById('translate').addEventListener('click', (ev) => {
        sendToExtMessage(value.trim()).then((msg) => {
            const {form, to, trans_result} = msg;
            let info = trans_result.reduce((res, item) => {
                const {dst, src} = item; // dst 翻译 src 原文
                return res + dst + '\n'
            }, '');
            document.getElementById('t-result').innerText = info
        })
    })

}

function sendToExtMessage (text) {
    return background.sendRequest(text)
}
