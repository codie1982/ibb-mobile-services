import { useState, useEffect } from 'react'
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
    //Açıklamalar
    useEffect(() => {
        //TODO : bu paketin doğruluğu kontrol edilmeli
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
        (async () => {
            if (typeof servis != "undefined") {
                servis.getToken(props.application_uuid)
                    .then(result => {
                        (async () => {
                            servis
                                .initialization(props.application_uuid, result.accessToken, result.isDeviceRegister)
                                .then((state) => {
                                    //Uygulama Tüm Bilgileri
                                    //Kullanıcı Bilgileri
                                    //Versiyon Bilgileri
                                    setApplicationInfo(state.application_info)
                                    setToken(result.accessToken)

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
                                    console.log("ERROR : ", error)
                                })
                        })()
                    }).catch(error => {
                        console.log("message : ", error)
                        console.error("Token Oluturulamıyor")
                    })
            }
        })()
    }, [servis])

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







