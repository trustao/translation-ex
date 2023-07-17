var content,time,resloveFn

setTimeout(() => {
    main()
})
function main () {
    content = document.createElement('div')
    content.className = "__chorme-extensions-easy-fanyi"
    content.style.display = 'none'
    document.body.appendChild(content)
    receiveMessage()
    stopProp()
    sendMessage({data: '_CHECK_STATUS_'}).then(() => {})
}

function closeTranslate () {
    document.removeEventListener('mouseup', mouseupHandler)
    document.removeEventListener('mousedown', mousedownHandler)
    content.style.display = 'none'
}

function startTranslate () {
    closeTranslate();
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
        sendMessage({data: txt.trim()}).then((msg) => {
            showContent(ev, msg)
        })
    }
}

function mousedownHandler (){
    content.style.display = 'none'
    time = Date.now()
}

function showContent (ev, msg) {
    const {form, to, trans_result} = msg;
    let info = trans_result.reduce((res, item) => {
        const {dst, src} = item; // dst 翻译 src 原文
        return res + dst + '<br>'
    }, '');
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
    return new Promise((reslove, reject) => {
        chrome.extension.sendRequest(data,function(response) {});
        resloveFn = reslove
    })
}

function receiveMessage () {
    chrome.extension.onRequest.addListener(
        function(request, sender, sendResponse) {
          if (request.action) {
              if (request.action === 'close') {
                closeTranslate()
              } else {
                startTranslate()
              }
          }
          resloveFn && resloveFn(request)
          resloveFn = null
        });
}

function treble (cb, sync) {
    var timer = null
    var complete = false
    var count = 0
    return function () {
        if (complete) return
        count++
        clearTimeout(timer)
        if (count === 3) {
            complete = true
            count = 0
            if (sync) {
                cb.apply(null, arguments)
                complete = false
            } else {
                const res = cb.apply(null, arguments)
                if (res instanceof Promise) {
                    res.finally(() => {
                        complete = false
                    })
                } else {
                    throw new Error('回调应返回')
                }
            }
            return
        }
        timer = setTimeout(() => {
            count = 0
        }, 200)
    }
}
