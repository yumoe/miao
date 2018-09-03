const WORDS = ['喵','呜', '嗷', '嘤', '咪']
$hide('url-a')
$click('decode-btn', () => {decodeBtn()})
$click('encode-btn', () => {encodeBtn()})


function int2Word(i) {
    return WORDS[i]
}
function word2Int(char) {
    for(let i = 0;i < WORDS.length;i++)
        if(char == WORDS[i])
            return i
}
function isBaiduDisk(url) {
    return url.indexOf('pan.baidu.com') > 1
}
function formatBaiduDisk(toFormat) {
    return toFormat.split(' ')
}
function encode(toEncode) {
    let str = toEncode.trim()
    let bin = ''
    let rs = ''
    if(isBaiduDisk(str))
        str = str.replace('链接：', '').replace('链接:', '').replace('密码：', '').replace('密码:', '')
    for(let i = 0;i < str.length;i++) {
        let code = str.charCodeAt(i).toString(5)
        if(code == '1120')
            code = '112'
        bin += code.length < 3 ? code.padStart(3, 0) : code
    }
    for(let i = 0;i < bin.length;i++)
        rs += int2Word(bin[i])
    return rs
}
function decode(toDecode) {
    let str = toDecode.trim()
    let bin = ''
    let binArr = []
    let rs = ''
    for(let i = 0;i < str.length;i++)
        bin += word2Int(str[i])
    for(let i = 0;i < bin.length;i = i + 3)
        binArr.push(bin.slice(i, i + 3))
    binArr.forEach(binItem => {
        rs += String.fromCharCode(Number.parseInt(binItem, 5))
    })
    return rs
}
function decodeBtn() {
    let str = decode($v('toDecode-area'))
    if(!str) {
        $notify('解析失败', 'muyu-notify-error')
        return
    }
    if(isBaiduDisk(str)) {
        let [url, key] = formatBaiduDisk(str)
        if(!url || !key) {
            $notify('解析失败', 'muyu-notify-error')
            return
        }
        $e('decode-btn').setAttribute('data-clipboard-text', key)
        new Clipboard('#decode-btn');
        $show('url-a')
        $click('url-a', () => {
            window.open(url)
            $hide('url-a')
        })
        $notify('密码已复制，请点击链接跳转')
    }
    else if(str.indexOf('http') === 0)
        window.open(str)
    else {
        $v('result-area', str)
        $notify('解析完成')
    }
}
function encodeBtn() {
    let rs = encode($v('toEncode-area'))
    if(!rs) {
        $notify('编码失败', 'muyu-notify-error')
        return
    }
    $v('result-area', rs)
    $e('encode-btn').setAttribute('data-clipboard-text', rs)
    new Clipboard('#encode-btn');
    $notify('喵码已复制')
}