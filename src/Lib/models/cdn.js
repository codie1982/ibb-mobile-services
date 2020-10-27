import { Dimensions } from "react-native"
import { settings } from "../../Lib/models/Settings"
export const combineURL = (url) => {
    return settings.BASEURL + "/" + url
}

export const setStyle = (imageWidth, imageHeight, percent,position) => {
    const { width, height } = Dimensions.get("screen")
    const rate = (width * percent / 100) / imageWidth
    if(position){
        return {
            top:((height-imageHeight)/2),
            left:(width-imageWidth)/2,
            width: imageWidth * rate,
            height: imageHeight * rate
        }
    }else {
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
    const txt = text1+text2;
    console.log(txt.length)
}
export const Color ={
    textColor:"#0E3B83",
    white:"#FFFFFF",
    testBackground:"#ff0000",
    testBorder:"#dc0101"

}