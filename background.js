const PATH = 'http://api.fanyi.baidu.com/api/trans/vip/translate'
const key = 'SrP2Su831fpYgi8cBKrB'
const appId = '20210304000714743'
const from = 'auto'
const to = 'auto'
receiveMessage()

let open = true;


chrome.storage.local.get(['key'], function(result) {
    open = !!result.key;
});


function getStatus() {
    return open;
}

function setStatus(v) {
    open = !!v
    chrome.storage.local.set({key: +open});
}

function setSign(text, salt) {
    try {
        return md5(appId + text + salt + key)
    } catch (e) {
        err('md5 failed')
    }
}

function err(er) {
    sendMessage({error: er})
}

function sendRequest(text) {
    return new Promise((resolve, reject) => {
        var salt = Date.now()
        var sign = setSign(text, salt)
        var xhr = new XMLHttpRequest()
        $.ajax({
            url: PATH,
            type: 'post',
            data: {
                q: text,
                appid: appId,
                salt: salt,
                from: from,
                to: to,
                sign: sign
            },
            success: function (data) {
                resolve(data);
            },
            fail: function (ev) {
                reject(ev);
            }
        });
    })
}

function sendMessage(data) {
    chrome.tabs.getSelected(null, function (tab) {
        chrome.tabs.sendRequest(tab.id, data, function (response) {
        });
    });
}

function receiveMessage() {
    chrome.extension.onRequest.addListener(function (request, sender, sendResponse) {
        if (request.data === '_CHECK_STATUS_') {
            sendMessage({action: open ? 'open' : 'close'})
        } else {
            request.data && sendRequest(request.data).then(data => sendMessage(data))
        }
    });
}
