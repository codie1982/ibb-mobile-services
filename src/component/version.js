import React, { useEffect, useState } from 'react'
import { Linking } from "react-native"
import { View, Text, Platform, Button, StyleSheet, NativeEventEmitter, DeviceEventEmitter, Image, Dimensions, TouchableOpacity, TouchableHighlight } from 'react-native'
import { RNInfo } from "../library/module"
import { combineURL, setStyle, Color, upperCase, combineURL_SENC } from "../library/models/cdn"
const CRITICAL = "critical"
const LOW = "low"
const IMPORTANT = "important"

export default function Version({ baseurl, detail, message, close, config }) {
    //console.log("Detail", detail)
    const [isLoading, setIsLoading] = useState(true)
    const [upgradeButton, setUpgradeButton] = useState("")
    const [progress, setProgress] = useState(0)
    const [downloadState, setDownloadState] = useState(null)
    const [location, setLocation] = useState(detail.info.version.location)
    const [versionColor, setVersionColor] = useState(detail.state.color)
    const [versionType, setVersionType] = useState(detail.info.version.type)
    const [versionDescription, setVersionDescription] = useState(detail.info.version.version_description)
    const [applicationTilte, setApplicationTilte] = useState(detail.info.application.title)
    const [applicationLogo, setApplicationLogo] = useState(detail.info.application.logo)

    /* bottom: {path: "static/images/bottom.png", width: 414, height: 69}
    logo: {path: "static/images/logo.png", width: 46, height: 44}
    main: {path: "static/images/image.png", width: 318, height: 310}
    top:  */


    const [topImage, setTopImage] = useState(detail.images.top)
    const [bottomImage, setBottomImage] = useState(detail.images.bottom)
    const [mainImage, setMainImage] = useState(detail.images.main)
    const [logo, setLogo] = useState(detail.images.logo)

    const [current_version, setCurrent_version] = useState(detail.version.number.current)
    const [publish_version, setPublish_version] = useState(detail.version.number.publish)

    const eventEmitter = new NativeEventEmitter(RNInfo);

    useEffect(() => {
        if (Platform.OS === 'android') {
            eventEmitter.addListener("eventProgress", (progress) => {
                console.log("progress", progress)
                setProgress(progress.progress)
            })
            eventEmitter.addListener("eventState", (state) => {
                console.log("state", state)
                setDownloadState(state)
            })
        } else {
            console.log("Yüklemeye Hazırlanıyor...")
        }
        return () => {
            if (Platform.OS == "android") {
                // eventEmitter.removeAllListeners()
            }
        }
    }, [])

    useEffect(() => {
        if (downloadState == null) {
            setUpgradeButton(upperCase("güncelle"))
        } else if (downloadState == "STATUS_PENDING!") {
            setUpgradeButton(upperCase("bekleniyor"))
        } else if (downloadState == "STATUS_RUNNING!") {
            const pgs = progress.toFixed(2) + "%"
            setUpgradeButton(pgs)
        } else if (downloadState == "STATUS_SUCCESSFUL!") {
            setUpgradeButton(upperCase("Başarılı"))
        } else {
            setUpgradeButton(upperCase("güncelle"))
        }
    }, [progress, downloadState])


    useEffect(() => {
        const ff = async () => {

            console.log("detail", detail)
            /* if (typeof detail != "undefined") {
                setBackgroundImage(
                    {
                        height: detail.images.top.height,
                        width: detail.images.top.width,
                        path: imageUrl
                    }
                )
            } */

            setIsLoading(false)
            if (detail.info.version.type == CRITICAL) {
                updateNewVersion()
            }
        }
        ff()
    }, [detail])

    const updateNewVersion = async () => {
        if (Platform.OS === 'android') {
            if (location == "global") {
                const supported = await Linking.canOpenURL(detail.info.version.url);
                if (supported) {
                    await Linking.openURL(detail.info.version.url);
                } else {
                    Alert.alert(`Belirtilen Linke Ulaşılamıyor: ${detail.info.version.url}`);
                }
            } else {
                if (downloadState != "STATUS_RUNNING!")
                    await RNInfo.uploadNewFile(detail.info.version.file, detail.info.version.filename)
            }
        } else if (Platform.OS === "ios") {
            if (location == "global") {
                const supported = await Linking.canOpenURL(detail.info.version.globalurl);
                if (supported) {
                    await Linking.openURL(detail.info.version.globalurl);
                } else {
                    Alert.alert(`Belirtilen Linke Ulaşılamıyor: ${detail.info.version.globalurl}`);
                }
            } else {
                const itmsServices = `itms-services://?action=download-manifest&url=${baseurl}${detail.info.version.itmsservices}`
                //TODO local servis üzerinden yükleme yapmıyor olabilir global bir servis üzerinden indirme yapılıyor daha sonra tekrardan bakmam gerekecek.
                const supported = await Linking.canOpenURL(itmsServices);
                if (supported) {
                    await Linking.openURL(itmsServices);
                } else {
                    Alert.alert(`Belirtilen İndir Ulaşılamıyor: ${itmsServices}`);
                }
            }

        }
    }

    const closeSplashScreen = async () => {
        close({
            type: detail.info.version.type,
            application_uuid: detail.application.application_uuid,
            package_name: detail.application.package_name,
            version_uuid: detail.application.version_uuid
        })
    }

    if (isLoading) {
        return <View style={styles.container}><Text>Yükleniyor...</Text></View>
    }
    return (
        <View style={styles.container}>
            <View style={styles.top_image} >
                {console.log("topImage", topImage)}
                <Image
                    style={setStyle(topImage.width, topImage.height, 100)}
                    source={{ uri: combineURL_SENC(topImage.path, config) }}
                />
            </View>
            <View style={styles.subContainer} >
                <View style={styles.background} >
                    {Dimensions.get("screen").height > 800 ?
                        <Image
                            style={setStyle(mainImage.width, mainImage.height, 80, true)}
                            source={{
                                uri:
                                    combineURL_SENC(mainImage.path, config),
                            }}
                        /> : null}

                </View>
                <View style={styles.section}>
                    <View style={styles.application_logo}>
                        <Image
                            style={styles.application_logo_image}
                            source={{
                                uri: applicationLogo,
                            }}
                        />
                    </View>
                    <View style={styles.version_alert} >
                        <Text style={{ ...styles.version_alert_text, color: versionColor }}>{"Yeni Bir Güncelleme Var"}</Text>
                    </View>
                    <View style={styles.application_title}>
                        <Text style={styles.application_title_text}>{applicationTilte}</Text>
                        <Text style={styles.application_title_text}>{" "}</Text>
                        <Text style={styles.application_title_text}>{"Uygulaması"}</Text>
                    </View>
                    <View style={styles.application_version}>
                        <Text style={styles.application_version_text}>V {current_version}</Text>
                        <Text style={styles.application_version_text}>{" ------> "}</Text>
                        <Text style={styles.application_version_text}>V {publish_version}</Text>
                    </View>
                    <View style={styles.version_description} >
                        <Text numberOfLines={4} style={{ ...styles.version_description_text, color: versionColor }}>{versionDescription}</Text>
                    </View>

                    <View style={styles.button_section}>
                        <TouchableOpacity disabled={downloadState == "STATUS_RUNNING!" ? true : false} style={styles.button_continer} onPress={updateNewVersion} >
                            <View style={{ ...styles.uploadButtonBack, shadowColor: versionColor, borderColor: versionColor, backgroundColor: versionColor, opacity: 0.1 }} />
                            <View style={{ ...styles.uploadButtonMiddel, borderColor: versionColor, backgroundColor: versionColor, opacity: 0.5 }} />
                            <View style={{ ...styles.uploadButton, borderColor: versionColor, backgroundColor: versionColor }} />
                            <Text style={styles.uploadText}>{upgradeButton}</Text>
                        </TouchableOpacity>
                        {versionType == CRITICAL ? null :
                            <TouchableOpacity disabled={downloadState == "STATUS_RUNNING!" ? true : false} style={styles.button_continer} onPress={closeSplashScreen} >
                                <View style={{ ...styles.uploadButtonBack, shadowColor: versionColor, borderColor: versionColor, backgroundColor: versionColor, opacity: 0.1 }} />
                                <View style={{ ...styles.uploadButtonMiddel, borderColor: versionColor, backgroundColor: versionColor, opacity: 0.5 }} />
                                <View style={{ ...styles.uploadButton, borderColor: versionColor, backgroundColor: versionColor }} />
                                <Text style={styles.uploadText}>{upperCase("sonra")}</Text>
                            </TouchableOpacity>}
                    </View>
                </View>
            </View>
            <View style={styles.bottom_image} >
                <Image
                    style={setStyle(bottomImage.width, bottomImage.height, 100)}
                    source={{
                        uri:
                            combineURL_SENC(bottomImage.path, config),
                    }}
                />
                <View style={styles.bottom_logo}>
                    <Image
                        style={setStyle(logo.width, logo.height, 12)}
                        source={{
                            uri:
                                combineURL_SENC(logo.path, config),
                        }}
                    />
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    subContainer: {
        flex: 1,
        width: "100%",
        height: "100%",
    },
    background: {
        position: "absolute",
        top: 0,
        left: 0,
    },
    section: {
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "center",
        marginVertical: 30,
    },
    application_logo: {
        width: 100,
        height: 100,
        backgroundColor: Color.white,
        borderWidth: 10,
        borderColor: Color.white,
        borderRadius: 25,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    application_logo_image: {
        width: "100%",
        height: "100%",
        borderWidth: 1,
        borderColor: Color.white,
        borderRadius: 10,
    },
    application_version: {
        flexDirection: "row",
        justifyContent: "center",
        alignContent: "center",
        width: Dimensions.get("screen").width * 90 / 100,
        height: 55,
    },
    application_version_text: {
        justifyContent: "center",
        alignContent: "center",
        alignSelf: "center",
        textAlign: "center",
        color: Color.textColor,
        fontSize: 13,
        fontWeight: "900",
    },
    application_title: {
        flexDirection: "row",
        width: Dimensions.get("screen").width * 90 / 100,
        height: 55,
        lineHeight: 55,
        backgroundColor: Color.white,
        borderWidth: 2,
        borderColor: Color.white,
        borderRadius: 25,
        marginTop: 20,
        paddingHorizontal: 15,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    version_alert: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
        width: Dimensions.get("screen").width * 90 / 100,
        padding: 10,
    },
    version_alert_text: {
        textAlign: "center",
        fontSize: 19,
    },
    version_description: {
        flexDirection: "row",
        width: Dimensions.get("screen").width * 90 / 100,
        padding: 10,
    },
    version_description_text: {
        textAlign: "center",
        fontSize: 19,
    },
    application_title_text: {
        justifyContent: "center",
        alignContent: "center",
        alignSelf: "center",
        textAlign: "center",
        color: Color.textColor,
        fontSize: 20,
        lineHeight: 35,
        fontWeight: "100",
    },

    application_title_text_bolder: {
        justifyContent: "center",
        alignContent: "center",
        alignSelf: "center",
        textAlign: "center",
        color: Color.textColor,
        fontSize: 20,
        lineHeight: 55,
        fontWeight: "900",
    },
    button_section: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center"
    },
    button_continer: {
        position: "relative",
        justifyContent: "center",
        alignContent: "center",
        width: 160,
        height: 160,
    },
    uploadButtonBack: {
        position: "absolute",
        top: 0,
        left: 0,
        justifyContent: "center",
        alignContent: "center",
        width: 160,
        height: 160,
        borderWidth: 2,
        borderRadius: 160,

        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    uploadButtonMiddel: {
        position: "absolute",
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
        width: 140,
        height: 140,
        borderWidth: 2,
        borderRadius: 140,
    },
    uploadButton: {
        position: "absolute",
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
        width: 120,
        height: 120,
        borderWidth: 2,
        borderRadius: 120,
    },
    uploadText: {
        textAlign: "center",
        fontSize: 20,
        color: Color.white
    },
    top_image: {
        position: "absolute",
        top: 0,
        left: 0,
    },
    bottom_image: {
        position: "absolute",
        bottom: 0,
        left: 0,
    },
    bottom_logo: {
        position: "absolute",
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
        paddingTop: 15
    },
})

