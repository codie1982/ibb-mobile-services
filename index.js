import { useState, useEffect, useCallback } from 'react'
import Servis from "./src/servis"
import Model from "./src/library/models/model"
import PropTypes from 'prop-types';

export default function IBB(props) {
    const [ims, setIms] = useState()
    const [servis, setNServis] = useState()
    const [applicationInfo, setApplicationInfo] = useState()
    const [token, setToken] = useState()
    const [screen, setScreen] = useState({ action: false, state: {} })
    const [screenCard, setScreenCard] = useState()
    const [netState, setNetState] = useState(null)
    const [isDeviceRegister, setIsDeviceRegister] = useState(false)

    //Açıklamalar
    useEffect(() => {
        //TODO : bu paketin doğruluğu kontrol edilmeli
        if (props.config != null)
            props.config.packages.NetInfo.addEventListener(state => {
                setNetState(state)
            });
    }, [])
    useEffect(() => {
        (async () => {
            if (netState != null) {
                const _servis = new Servis()
                await _servis.setServis(props.config, props.application_uuid, props.secret, netState)
                setNServis(_servis)
            }
        })()
    }, [netState])
    useEffect(() => {
        if (typeof servis != "undefined") {
            if (token == null) {
                servis.getToken(props.application_uuid)
                    .then(result => {
                        if (result) setToken(result.accessToken)
                    }).catch(error => {
                        console.log("message : ", error)
                        console.error("Token Oluturulamıyor")
                    })
            }
        }
    }, [servis])
    
    useEffect(() => {
        try {
            if (token != null) {
                servis.initialization(props.application_uuid, token)
                    .then((state) => {
                        console.log("state", state)
                        //Uygulama Tüm Bilgileri
                        //Kullanıcı Bilgileri
                        //Versiyon Bilgileri
                        if (state != null) {
                            if (state.success) {
                                let data = state.data
                                setApplicationInfo(data.application_info)
                                setToken(token)
                                setScreenCard(data.version_info.card)
                                setScreen({
                                    action: data.version_info.action,
                                    component: data.version_info.component,
                                    type: data.version_info.type,
                                    publish_version: data.version_info.version,
                                    message: data.version_info.message,
                                    application: {
                                        application: data.application_info.application,
                                        package: data.application_info.package,
                                        current_version: data.application_info.current_version,
                                    }
                                })
                                props.onReady(state)
                            }
                        }
                    }).catch(error => {
                        console.log("initialization HATA : ", error.message)
                    })
            }
        } catch (error) {
            console.log("TRY CATCH initialization HATA : ", error)
        }

    }, [token])

    const closeScreen = () => { setScreen({ action: false }) }
    if (screen.action) {
        return servis.getComponent(
            screen.component,
            screen.type, screen.publish_version,
            screen.message, screen.application, token, screenCard, closeScreen)
    } else {
        return (
            props.children
        )
    }
}

export function addFcmToken(fcmToken) {
    console.log("token", token)
    console.log("addFcmToken", fcmToken)
}

IBB.propTypes = {
    application_uuid: PropTypes.string,
    config: PropTypes.object,
    onInit: PropTypes.func
};







