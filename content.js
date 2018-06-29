var content,time,resloveFn

main()

function main () {
    content = document.createElement('div')
    content.className = "translation-ex-warp"
    content.style.display = 'none'
    document.body.appendChild(content)
    startTranslate()
    receiveMessage()
    stopProp()
}

function closeTranslate () {
    document.removeEventListener('mouseup', mouseupHandler)
    document.removeEventListener('mousedown', mousedownHandler)
    content.style.display = 'none'
}

function startTranslate () {
    document.addEventListener('mouseup', mouseupHandler)
    document.addEventListener('mousedown', mousedownHandler)
}

function stopProp () {
    content.addEventListener('mousedown', function(ev){
        ev.stopPropagation()
    })
    content.addEventListener('mouseup', function(ev){
        ev.stopPropagation()
    })
}

function mouseupHandler (ev) {
    if (time && time < Date.now() - 300) {
        var txt = document.getSelection().toString();
        if (!txt.trim()) return
        sendMessage({data: txt.trim()}).then(({basic, translation}) => {
            showContent(ev, basic ? Object.assign(basic, {translation}) : translation)
        })
    }
}

function mousedownHandler (){
    content.style.display = 'none'
    time = Date.now()
}

function showContent (ev, info) {
    if (Array.isArray(info) && info.length > 1) {
        info = info.reduce(($0, $1, $2) => (1 + $2) + '、' + $0 + $1 + '<br/>', '')
    }
    if (info.toString() ===  "[object Object]") {
        info = '<p> 发音：' + (info.phonetic || '') + '</p>' 
        + info.explains.reduce(($0, $1, $2) => $0 + '<p>'+ $1 + '</p>', '')
    }
    var viewH = window.innerHeight
    var viewW = window.innerWidth
    var x = ev.clientX + 10
    var y = ev.clientY + 10
    var resX = x
    var resY = y
    if (x > viewW - 200) resX = x - 200
    if (y > viewH - 200) resY = y - 200
    content.style.top = resY + 'px'
    content.style.left = resX + 'px'
    content.innerHTML = info
    content.style.display = 'block'    
}

function sendMessage (data) {
    console.log('content send message')
    return new Promise((reslove, reject) => {
        chrome.extension.sendRequest(data,function(response) {});
        resloveFn = reslove
    })
}

function receiveMessage () {
    chrome.extension.onRequest.addListener(
        function(request, sender, sendResponse) {
          console.log('receive message', request)
          if (request.action) {
              if (request.action === 'close') {
                console.log('close')
                closeTranslate()
              } else {
                console.log('open')
                startTranslate()
              }
          }
          resloveFn && resloveFn(request)
          resloveFn = null
        });
}