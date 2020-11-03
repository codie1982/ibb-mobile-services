import { Dimensions } from "react-native"
import Settings from "./settings"
export const combineURL = (url, config) => {
    return new Promise((resolve, reject) => {
        const settings = new Settings;
        settings.setSettings(config).then(cdn => {
            resolve(cdn.base_url + "/" + url)
        })
    })
}
export const combineURL_SENC = (url, config) => {
    const settings = new Settings;
    settings.setSettings(config).then(cdn => {
        console.log("cdn.base_url/url", cdn.base_url + "/" + url)
        return (cdn.base_url + "/" + url)
    })

}
export const setStyle = (imageWidth, imageHeight, percent, position) => {
    const { width, height } = Dimensions.get("screen")
    const rate = (width * percent / 100) / imageWidth
    if (position) {
        return {
            top: ((height - imageHeight) / 2),
            left: (width - imageWidth) / 2,
            width: imageWidth * rate,
            height: imageHeight * rate
        }
    } else {
        return {
            width: imageWidth * rate,
            height: imageHeight * rate
        }
    }

}
export const upperCase = (str) => {
    return str.toUpperCase()
}
export const textLength = (text1, text2) => {
    const txt = text1 + text2;
    console.log(txt.length)
}
export const Color = {
    textColor: "#0E3B83",
    white: "#FFFFFF",
    testBackground: "#ff0000",
    testBorder: "#dc0101"

}