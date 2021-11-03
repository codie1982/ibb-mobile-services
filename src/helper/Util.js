const WASTE = 0.000000001;
export const setPersentDownload = (byte, total_byte) => {
    return ((parseFloat(byte) * 100) / total_byte) + WASTE;
}
export const encodeRepresentionid = (application_uuid, deviceid, version_number) => {
    return application_uuid + "-" + deviceid + "-" + version_number
}
export const setName = (str) => {
    if (typeof str != "undefined") {
        let _str = str.split(' ')
        if (_str.length == 0) return null;
        const lwr = _str.map(item => item.toLowerCase())
        const one = lwr.reduce((arr, item) => {
            return arr += item
        }, "")
        return one;
    } else {
        return null
    }
}
export const byteTo = (byte, type, number = 2) => {
    let _type = type.toLowerCase()
    let result;
    switch (_type) {
        case "gb":
            result = byte / 1024 / 1024 / 1024
            break;
        case "mb":
            result = byte / 1024 / 1024
            break;
        case "kb":
            result = byte / 1024
            break;
        default:
            result = byte / 1024 / 1024
            break;
    }
    return result.toFixed(number);
}
export const ucWords = (s) => {
    if (typeof s !== 'string') return ''
    return s.charAt(0).toUpperCase() + s.slice(1)
}
export const ucFirst = (s) => {
    return (s + '')
        .replace(/^(.)|\s+(.)/g, function ($1) {
            return $1.toUpperCase()
        })
}
export const addToken = (uri, token) => {
    return uri + "&" + "token" + "=" + token
}