const PATH = 'http://openapi.youdao.com/api'
const key = 'nCLIiNjxSNoyxyplRx2p53WF9hCuO0We'
const appId = '418921c915eab784'
const from = 'auto'
const to = 'auto'
receiveMessage()

function setSign(text, salt) {
    try {
        return md5(appId + text + salt + key)
    } catch (e) {
        err('md5 failed')
    }
}
function err (er) {
    sendMessage({error: er})
}

function sendRequest (text) {
    var salt = Date.now()
    var sign = setSign(text, salt)
    var xhr = new XMLHttpRequest()
    $.ajax({
        url: PATH,
        type: 'post',
        data: {
            q: text,
            appKey: appId,
            salt: salt,
            from: from,
            to: to,
            sign: sign
        },
        success: function (data) {
            sendMessage(data);
        },
        fail: function () {
            err('网络错误');
        }
    });
}

function sendMessage (data) {
    chrome.tabs.getSelected(null, function(tab) {
        chrome.tabs.sendRequest(tab.id, data, function(response) {});
    });
}

function receiveMessage () {
    chrome.extension.onRequest.addListener(
        function(request, sender, sendResponse) {
            request.data && sendRequest(request.data)
        });
}
