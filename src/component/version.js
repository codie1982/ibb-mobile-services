import React, { useEffect, useState } from 'react'
import { Linking } from "react-native"
import { View, Text, Platform, Button, StyleSheet, NativeEventEmitter, DeviceEventEmitter, Image, Dimensions, TouchableOpacity, TouchableHighlight } from 'react-native'
import { RNIbbMobileServices } from "../library/module"
import { combineURL, setStyle, Color, upperCase } from "../library/models/cdn"
import * as Util from "../helper/Util"
import Request from "../library/http"
import { ucFirst } from '../../../../src/lib/utils/util'
import { result } from 'lodash'
const CRITICAL = "critical"
const LOW = "low"
const IMPORTANT = "important"

const STAY = "stay"
const DOWNLOADED = "downloaded"
const STATUS_FAILED = 16
const STATUS_PAUSED = 4
const STATUS_PENDING = 1
const STATUS_RUNNING = 2
const STATUS_SUCCESSFUL = 8


const REPRESENTATIONSTATE = {
    install: "install",
    download: "download",
    fail: "fail",
}
const IBBSTORE = "ibbstore"
const GLOBALSTORE = "globalstore"
export default function Version({ baseurl, publish_version, message, application, token, settings, close }) {
    //console.log("Detail", detail)
    const [isLoading, setIsLoading] = useState(true)
    const [upgradeButton, setUpgradeButton] = useState("")
    const [progress, setProgress] = useState(0)
    //const [downloadState, setDownloadState] = useState(null)
    const [versionColor, setVersionColor] = useState(publish_version.state.color)
    const [versionType, setVersionType] = useState(publish_version.info.version.type)
    const [versionDescription, setVersionDescription] = useState(publish_version.info.version.version_description)
    const [applicationTilte, setApplicationTilte] = useState(application.application.title)
    const [applicationLogo, setApplicationLogo] = useState(application.application.logo)

    //representation
    const [representionState, setRepresentionState] = useState(null)

    //ismini Ayarla
    const [applicationname, setApplicationname] = useState(Util.setName(publish_version.info.name))
    //Yayınlanma Yeri
    const [publish_location, setPublish_location] = useState(publish_version.info.version.location)

    //Üst Resim
    const [topImage, setTopImage] = useState(publish_version.images.top)
    //Alt Resim
    const [bottomImage, setBottomImage] = useState(publish_version.images.bottom)
    //Orta Resim
    const [mainImage, setMainImage] = useState(publish_version.images.main)
    //IBB Logo
    const [logo, setLogo] = useState(publish_version.images.logo)

    const [current_version_number, setCurrent_version_number] = useState(publish_version.version.number.current)
    const [publish_version_number, setPublish_version_number] = useState(publish_version.version.number.publish)

    const eventEmitter = new NativeEventEmitter(RNIbbMobileServices);
    const [isDownloadedble, setIsDownloadedble] = useState(true)

    const [persent, setPersent] = useState(0)
    const [downloadStatus, setDownloadStatus] = useState(null)
    const [downloadStatusText, setDownloadStatusText] = useState(null)
    const [downloadedBytes, setDownloadedBytes] = useState(null)

    const [buttonDisable, setButtonDisable] = useState(false)
    const [newRepresentionResponse, setNewRepresentionResponse] = useState(null)
    const [repInstalResponse, setRepInstalResponse] = useState(null)
    const [fileSize, setFileSize] = useState()
    const [representeid, setRepresenteID] = useState()
    useEffect(() => {
        //ilk Reset İşlemleri

        //await dispatch(resetRepresention())
        setDownloadStatus(null)
        setRepresentionState(null)
        setDownloadedBytes(null)
        setPersent(0)
        //setDownloadState(false)
        setUpgradeButton(upperCase("güncelle"))
        if (Platform.OS === 'android') {
            eventEmitter.addListener("eventProgress", (event) => {
                setDownloadedBytes(event.downloaded_bytes)
            })
            eventEmitter.addListener("eventStatus", (status) => {
                setDownloadStatus(status)
            })
        } else {
            console.log("Yüklemeye Hazırlanıyor...")
        }
        if (publish_version != null) {
            setFileSize(publish_version.info.version.filesize.size)
            setRepresenteID(Util.encodeRepresentionid(application.application.application_uuid, settings.device.device_id, publish_version.version.number.publish))
        }
        return () => {
            if (Platform.OS === 'android') {
                eventEmitter.removeListener("eventProgress")
                eventEmitter.removeListener("eventStatus")
            } else {
                console.log("Yüklemeye Hazırlanıyor...")
            }
        }
    }, [])

    useEffect(() => {
        if (publish_version != null)
            setPersent(Util.setPersentDownload(downloadedBytes, publish_version.info.version.filesize.size))
    }, [downloadedBytes])

    useEffect(() => {
        setIsLoading(false)
        //Gelen güncelleme kritik ise otomatik indirme prosedürünü başlatıyoruz.
        if (publish_version.info.version.type == CRITICAL) {
            updateNewVersion()
        }
    }, [publish_version])

    //Response
    useEffect(() => {
        if (newRepresentionResponse != null)
            if (newRepresentionResponse)
                setRepresentionState(REPRESENTATIONSTATE.download)


    }, [newRepresentionResponse])
    //RepresentationInstall
    useEffect(() => {
        if (repInstalResponse != null)
            if (repInstalResponse)
                setRepresentionState(REPRESENTATIONSTATE.install)
    }, [repInstalResponse])

    //RepresentStatus
    useEffect(() => {
        (async () => {
            if (representionState != null) {
                switch (representionState) {
                    case REPRESENTATIONSTATE.download:
                        console.log("9.1. represention_state - download")
                        if (Platform.OS == "android") {
                            console.log("9.1.2. uri: ", publish_version.info.version.file)
                            setDownloadStatus(true)
                            await RNIbbMobileServices.setDownload(publish_version.info.version.file)
                        }
                        break;
                    case REPRESENTATIONSTATE.install:
                        if (Platform.OS == "android") {
                            console.log("4. represention_state - install")
                            await RNIbbMobileServices.installApplication()
                            setRepresentionState(null)
                        }
                        break;
                    case REPRESENTATIONSTATE.fail:
                        console.log("represention_state FAIL")
                        setRepresentionState(null)
                        break;
                    default:
                        console.log("represention_state belirsiz")
                        setRepresentionState(null)
                        break;
                }
            }
        })()
    }, [representionState])

    //Download Status
    useEffect(() => {
        (async () => {
            if (downloadStatus != null) {
                const request = new Request();
                switch (downloadStatus) {
                    case STATUS_PENDING:
                        setDownloadStatusText("Beklemede...")
                        setUpgradeButton(upperCase("bekleniyor"))
                        break;
                    case STATUS_RUNNING:
                        setDownloadStatusText("Yükleniyor...")
                        break;
                    case STATUS_PAUSED:
                        setDownloadStatusText("Durduruldu...")
                        break;
                    case STATUS_SUCCESSFUL:
                        setUpgradeButton(upperCase("Başarılı"))
                        setDownloadStatusText(null)
                        setDownloadStatus(false)
                        await request.send(settings.url.representation.finish, {
                            representationid: representeid,
                            data: {
                                download_status: STATUS_SUCCESSFUL,
                                progress: 100,
                            }
                        }, token)
                        //Kuruluma Geç
                        preInstallApplication()
                        break;
                    case STATUS_FAILED:
                        setDownloadStatusText("Başarısız...")
                        setDownloadStatus(false)

                        await request.send(settings.url.representation.finish, {
                            representationid: representeid,
                            data: {
                                download_status: STATUS_FAILED,
                                progress: persent,
                            }
                        }, token)
                        break;
                    default:
                        setUpgradeButton(upperCase("güncelle"))
                        setDownloadStatusText(null)
                        setDownloadStatus(false)
                        break;
                }
            }
        })()

    }, [downloadStatus, persent])

    useEffect(() => {
        if (downloadStatus == STATUS_RUNNING)
            setUpgradeButton(persent.toFixed(2) + "%")
    }, [persent])

    //Uygulamayı güncellemek için
    const updateNewVersion = async () => {
        //Topikleri 1 grup olarak oluştur
        //Uygulama paketi

        //********************************* Android için *********************************

        //TODO : Mevcut dosya dizinde indirilmiş mi diye kontrol et
        //TODO : Mevcut dosya dizinde indirilmiş dosya var ise alert ile dosyanın  kurayımmı yeniden indiriyeyimmi diye sorulabilir.
        //TODO : Mevcut dosya dizinde indirilmiş yeniden kurulda hata oluşuyorsa dosyayı kaldır ve prosedüre yeniden başla

        //TODO : Uygulamarı kendi ismi birşeştirerek download içinde bir dizin oluştur
        //TODO : Uygulamarı kendi ismi birleştirerek ve versiyon numarsı eklenerek yeni dosya oluştur

        //TODO : Uygulamayı indirmeye Başla
        //TODO : Uygulamanın İndirme durumunu değiştir
        //TODO : Uygulamanın indirme tamamlandığında servise indirme tamamlandı olarak işle
        //TODO : Uygulamayı Topic olarak kaydet
        //TODO : uygulamanın Kurulumuna Geç
        //TODO : Uygulamanın kurulumu uygulamanın içinden npm servis üzerinden kontrol edilecek

        //********************************* IOS için *********************************

        //TODO : Uygulama yükle butonuna basıldıktan sonra Global servise represention olarak işle
        //TODO : uygulamayı Topik olarak ekle
        //TODO : Uygulama indirme ve kurulum işlemleri otomatik olarak yapılır

        //1.Adım Subscribe topik TODO : NPM modulü içinde FCM Token almayı araştır.
        //const fcmToken = await getData("fcmToken")

        /*  const subScribeData = {
             package_uuid: selected_package.package_uuid,
             fcmToken: fcmToken,
         } */

        //Uygulamayı takip ettiriyoruz.
        //ÖNEMLİ : başlıklar paket bazında alınır. mesajlar paketlere istinaden atılır. Uygulamaya mesaj atmak için mevcut paketlerin olduğu bir condition ile mesaj atmak gerekli
        //await dispatch(subScribeApplication(subScribeData))
        //İndirme yerine göre

        if (isDownloadedble) {
            //Uygulama global store 'da yüklü ise global store tarafına yönlendirilebilir.
            if (publish_location == IBBSTORE) {
                await RNIbbMobileServices.setFile(applicationTilte, parseInt(settings.device.verison_number))
                await RNIbbMobileServices.checkDestination()
                    .then(isExist => {
                        (async () => {
                            console.log("1. isExist", isExist)
                            if (isExist) {
                                await RNIbbMobileServices.checkFileAccuracy(publish_version.info.version.filesize.size)
                                    .then(accuracy => {
                                        (async () => {
                                            if (accuracy) {
                                                Alert.alert("Hata", "Daha önce indirilen bir dosya mevcutta",
                                                    [
                                                        {
                                                            text: "Yeniden İndir",
                                                            onPress: async () => {
                                                                await RNIbbMobileServices.deleteFile()
                                                                preDownloadApplication()
                                                            }
                                                        },
                                                        {
                                                            text: "Vazgeç",
                                                            onPress: () => console.log("Cancel Pressed"),
                                                            style: "cancel"
                                                        },
                                                        { text: "Kur", onPress: () => preInstallApplication() }
                                                    ])
                                            } else {
                                                //Dosya Hatalı ise Dosyayı silip yeniden Indir
                                                await RNIbbMobileServices.deleteFile()
                                                preDownloadApplication()
                                            }
                                        })()
                                    })
                            } else {
                                //Dosya Bulunmuyorsa
                                //indirme Proedürlerini uygula
                                console.log("2. preDownloadApplication")
                                preDownloadApplication()
                            }
                        })()
                    }).catch(err => {
                        console.log("HATA ", err)
                    })
            }
        }
    }

    //Uygulamaı indirmek için
    const preDownloadApplication = async () => {
        //Indirme Prosedürleri
        //Repreant ID'si oluştur {{application_uuid-deviceid-version_number-mobile}}
        //Yeni bir represention oluştur
        //indirmeye başla TODO : Token ekleyebiliriz. Servisden alınacak bir token.
        //Durumu değiştir
        //Indirme tamamlandı
        //Durum Success --> Evet  --> Representionı güncelle Durum Success olarak -> Kurulum prosedürleri
        //          |
        //          V
        //         Hayır
        // Representionı güncelle Durum Fail olarak --> İşlemi Bitir
        console.log("3. downloadApplication")
        if (Platform.OS == "android") {
            //Dosya İndirmesi
            console.log("publish_version", publish_version)
            const representiondata =
            {
                representationid: representeid,
                application_uuid: publish_version.application.application_uuid,
                package_name: publish_version.application.package_name,
                package_uuid: publish_version.application.package_uuid,//Burası Yeni
                version_uuid: publish_version.application.version_uuid,
                platform: Platform.OS,
                deviceid: settings.device.device_id,
                location: "npmmodule",
                version_number: publish_version.version.number.publish,
                download_status: STATUS_PENDING,
                progress: 0,
                ipAddress: settings.netinfo.ipAddress
            }
            console.log("4. Platform.Version", Platform.Version)
            if (Platform.Version > 19) {
                console.log("5. represention data", representiondata)
                //Yeni bir Represent oluştur
                const request = new Request();
                const response = await request.send(settings.url.representation.new, { representiondata, userid: null }, token)
                console.log("represention data response", response)
                setNewRepresentionResponse(response)
            } else {
                Alert.alert("HATA", "Dosya indirme ve yükleme işlemleri Android 19 versiyonu (Android KITKAT) altını desteklemez")
            }
        } else {
            //Platform IOS
        }
    }
    //Uygulamayı Kurmak için
    const preInstallApplication = async () => {
        if (Platform.OS == "android") {
            console.log("1. preInstallApplication RepID", { id: representeid })
            setRepresentionState(REPRESENTATIONSTATE.install)
        }
    }
    //Ekranı Kapatmak için
    const closeSplashScreen = async () => {
        close({
            type: publish_version.info.version.type,
            application_uuid: publish_version.application.application_uuid,
            package_name: publish_version.application.package_name,
            version_uuid: publish_version.application.version_uuid
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
                    source={{ uri: combineURL(topImage.path, baseurl) }}
                />
            </View>
            <View style={styles.subContainer} >
                <View style={styles.background} >
                    {Dimensions.get("screen").height > 800 ?
                        <Image
                            style={setStyle(mainImage.width, mainImage.height, 80, true)}
                            source={{
                                uri:
                                    combineURL(mainImage.path, baseurl),
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
                        <Text style={{ ...styles.version_alert_text, color: Color.textColor }}>{"Yeni Bir Güncelleme Var"}</Text>
                    </View>
                    <View style={styles.application_title}>
                        <Text style={styles.application_title_bold_text}>{applicationTilte}</Text>
                        <Text style={styles.application_title_text}>{" "}</Text>
                        <Text style={styles.application_title_text}>{"Uygulaması"}</Text>
                    </View>
                    <View style={styles.application_version}>
                        <Text style={styles.application_version_text}>V {current_version_number}</Text>
                        <Text style={styles.application_version_text}>{" ------> "}</Text>
                        <Text style={styles.application_version_text}>V {publish_version_number}</Text>
                    </View>
                    {typeof versionDescription == "object" ?
                        <View style={styles.version_description_list} >
                            {versionDescription.map(item => (
                                <Text style={{ ...styles.version_description_text_list, color: Color.textColor }}>{ucFirst(item)}</Text>
                            ))}
                        </View>
                        :
                        <View style={styles.version_description} >
                            <Text numberOfLines={4} style={{ ...styles.version_description_text, color: Color.textColor }}>{ucFirst(versionDescription)}</Text>
                        </View>
                    }
                    <View style={styles.button_section}>
                        <TouchableOpacity disabled={downloadStatus == STATUS_RUNNING ? true : false} style={styles.button_continer} onPress={updateNewVersion} >
                            <View style={{ ...styles.uploadButtonBack, shadowColor: versionColor, borderColor: versionColor, backgroundColor: versionColor, opacity: 0.1 }} />
                            <View style={{ ...styles.uploadButtonMiddel, borderColor: versionColor, backgroundColor: versionColor, opacity: 0.5 }} />
                            <View style={{ ...styles.uploadButton, borderColor: versionColor, backgroundColor: versionColor }} />
                            <Text style={styles.uploadText}>{upgradeButton}</Text>
                        </TouchableOpacity>
                        {versionType == CRITICAL ? null :
                            <TouchableOpacity disabled={downloadStatus == STATUS_RUNNING ? true : false} style={styles.button_continer} onPress={closeSplashScreen} >
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
                            combineURL(bottomImage.path, baseurl),
                    }}
                />
                <View style={styles.bottom_logo}>
                    <Image
                        style={setStyle(logo.width, logo.height, 12)}
                        source={{
                            uri:
                                combineURL(logo.path, baseurl),
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
        justifyContent: "center",
        alignItems: "center",
        width: Dimensions.get("screen").width * 90 / 100,
        height: 55,
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
    version_description_list: {
        width: Dimensions.get("screen").width * 90 / 100,
        padding: 5,
    },
    version_description_text_list: {
        textAlign: "left",
        fontSize: 18,
        lineHeight: 18,
        marginVertical: 3
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
    application_title_bold_text: {
        justifyContent: "center",
        alignContent: "center",
        alignSelf: "center",
        textAlign: "center",
        color: Color.textColor,
        fontSize: 24,
        lineHeight: 35,
        fontWeight: "900",
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

