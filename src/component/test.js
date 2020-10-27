import React, { useEffect, useState } from 'react'
import { Linking } from "react-native"
import { View, Text, Platform, Button, StyleSheet, NativeEventEmitter, DeviceEventEmitter, Image, Dimensions, TouchableOpacity, TouchableHighlight } from 'react-native'
import { RNInfo } from "../Lib/module"
import { combineURL, setStyle, Color, upperCase } from "../Lib/models/cdn"
const CRITICAL = "critical"
const LOW = "low"
const IMPORTANT = "important"

export default function Version({ detail, message, close }) {
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
    const [topImage, setTopImage] = useState(detail.images.top)
    const [bottomImage, setBottomImage] = useState(detail.images.bottom)
    const [mainImage, setMainImage] = useState(detail.images.main)
    const [current_version, setCurrent_version] = useState(detail.version.number.current)
    const [publish_version, setPublish_version] = useState(detail.version.number.publish)
    const [logo, setLogo] = useState(detail.images.logo)
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
        console.log(combineURL(topImage.path))
        setIsLoading(false)
        if (detail.info.version.type == CRITICAL) {
            updateNewVersion()
        }
    }, [detail])

    const updateNewVersion = async () => {
        console.log("detail", detail)
        if (Platform.OS === 'android') {
            if (location == "global") {
                const supported = await Linking.canOpenURL(detail.info.version.url);
                console.log("detail.info.version.url", detail.info.version.url)
                if (supported) {
                    await Linking.openURL(detail.info.version.url);
                } else {
                    Alert.alert(`Belirtilen Linke Ulaşılamıyor: ${detail.info.version.url}`);
                }
            } else {
                if (downloadState != "STATUS_RUNNING!")
                    await RNInfo.uploadNewFile(detail.info.version.file, detail.info.version.filename)
            }
        } else if (Platform.OS == "ios") {
            //TODO local servis üzerinden yükleme yapmıyor olabilir global bir servis üzerinden indirme yapılıyor daha sonra tekrardan bakmam gerekecek.
            //console.log("Yüklemeye Başla", detail.info.version.url)
            const supported = await Linking.canOpenURL(detail.info.version.url);
            if (supported) {
                await Linking.openURL(detail.info.version.url);
            } else {
                Alert.alert(`Belirtilen İndir Ulaşılamıyor: ${detail.info.version.url}`);
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
                <Image
                    style={setStyle(topImage.width, topImage.height, 100)}
                    source={{
                        uri:
                            combineURL(topImage.path),
                    }}
                />
            </View>
            <View style={styles.subContainer} >
                <View style={styles.background} >
                    {Dimensions.get("screen").height > 800 ?
                        <Image
                            style={setStyle(mainImage.width, mainImage.height, 80, true)}
                            source={{
                                uri:
                                    combineURL(mainImage.path),
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
                        <View style={styles.testsection}><Text style={styles.testsectiontext}>Test</Text></View>
                    </View>
                    <View style={styles.application_title}>
                        <Text style={styles.application_title_text_bolder}>{applicationTilte}</Text>
                        <Text style={styles.application_title_text}>{" "}</Text>
                        <Text style={styles.application_title_text}>{"Uygulaması"}</Text>
                    </View>
                    <View style={styles.application_version}>
                        <Text style={styles.application_version_text}>TEST Versiyonu</Text>
                    </View>
                    <View style={styles.version_description} ><Text style={{ ...styles.version_description_text, color: versionColor }}>{versionDescription}</Text></View>
                    <View style={styles.button_section}>
                        <TouchableOpacity disabled={downloadState == "STATUS_RUNNING!" ? true : false}  style={styles.button_continer} onPress={updateNewVersion} >
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
                            combineURL(bottomImage.path),
                    }}
                />
                <View style={styles.bottom_logo}>
                    <Image
                        style={setStyle(logo.width, logo.height, 12)}
                        source={{
                            uri:
                                combineURL(logo.path),
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
    version_description: {
        flexDirection: "row",
        width: Dimensions.get("screen").width * 90 / 100,
        padding: 20,
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
        fontSize: 30,
        lineHeight: 55,
        fontWeight: "100",
    },

    application_title_text_bolder: {
        justifyContent: "center",
        alignContent: "center",
        alignSelf: "center",
        textAlign: "center",
        color: Color.textColor,
        fontSize: 20,
        fontWeight: "900",
        lineHeight: 55
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
    testsection: {
        position: "absolute",
        top: -10,
        left: -10,
        backgroundColor: Color.testBackground,
        borderColor: Color.testBorder,
        borderWidth: 1,
        borderRadius: 5,
        padding: 2,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        transform: [{ rotate: "-45deg" }]

    },
    testsectiontext: {
        color: Color.white,
        fontSize: 16,
        fontWeight: "600"
    }
})

