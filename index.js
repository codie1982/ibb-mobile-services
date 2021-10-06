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
    const [netState, setNetState] = useState(null)
    const [isDeviceRegister, setIsDeviceRegister] = useState(false)
    //Açıklamalar
    useEffect(() => {
        //TODO : bu paketin doğruluğu kontrol edilmeli
        console.log("props.config", props.config)
        if (props.config != null)
            props.config.packages.NetInfo.addEventListener(state => {
                setNetState(state)
            });
    }, [])

    useEffect(() => {
        (async () => {
            if (netState != null) {
                const _servis = new Servis()
                await _servis.setServis(props.config, props.application_uuid, netState)
                setNServis(_servis)
            }
        })()
    }, [netState])

    useEffect(() => {
        if (typeof servis != "undefined") {
            if (token == null) {
                servis.getToken(props.application_uuid)
                    .then(result => {
                        setIsDeviceRegister(result.isDeviceRegister)
                        setToken(result.accessToken)
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
                servis
                    .initialization(props.application_uuid, token, isDeviceRegister)
                    .then((state) => {
                        console.log("state", state)
                        //Uygulama Tüm Bilgileri
                        //Kullanıcı Bilgileri
                        //Versiyon Bilgileri
                        setApplicationInfo(state.application_info)
                        setToken(token.accessToken)
                        setScreen({
                            action: state.version_info.action,
                            component: state.version_info.component,
                            type: state.version_info.type,
                            publish_version: state.version_info.version,
                            message: state.version_info.message,
                            application: {
                                application: state.application_info.application,
                                package: state.application_info.package,
                                current_version: state.application_info.current_version,
                            }
                        })
                    }).catch(error => {
                        console.log("initialization HATA : ", error.message)
                    })
            }
        } catch (error) {
            console.log("TRY CATCH initialization HATA : ", error)
        }

    }, [token])

    const closeScreen = () => {
        setScreen({ action: false })
    }
    if (screen.action) {
        return servis.getComponent(screen.component, screen.type, screen.publish_version, screen.message, screen.application, token, closeScreen)
    } else {
        return (
            props.children
        )
    }
}


IBB.propTypes = {
    application_uuid: PropTypes.string,
    config: PropTypes.object
};







