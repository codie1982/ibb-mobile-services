import { useState, useEffect } from 'react'
import IMS from "./src/ims"
import PropTypes from 'prop-types';

export default function IBB(props) {
    const [ims, setIms] = useState()
    const [applicationInfo, setApplicationInfo] = useState()
    const [token, setToken] = useState()
    const [screen, setScreen] = useState({ action: false, state: {} })
    //Açıklamalar
    useEffect(() => {
        const start = async () => {
            setIms(await new IMS(props.config))
        }
        start()
    }, [])

    useEffect(() => {
        const ff = async () => {
            if (typeof ims != "undefined") {
                ims.getToken(props.application_uuid)
                    .then(result => {
                        (async () => {
                            await ims.init(props.application_uuid, result.token).then(async (application_info) => {
                                //Uygulama Tüm Bilgileri
                                setApplicationInfo(application_info)
                                setToken(result.token)
                            }).catch(error => {
                                console.log("ERROR : ", error)
                            })
                        })()
                    }).catch(error => console.log("message : ", error))
            }
        }
        ff()
    }, [ims])

    useEffect(() => {
        const check = async () => {
            if (typeof token == "undefined" || token == null) {
                console.log("Token Alınamıyor..")
            } else {
                try {
                    //versiyon durumu kontrol ediliyor...
                    console.log("versiyon durumu kontrol ediliyor...")
                    if (typeof applicationInfo != "undefined") {
                        const state = await ims.setState(applicationInfo, token)
                        console.log("state", state)
                        setScreen({ action: state.action, state: state })
                    } else {
                        console.log("Uygulama Bilgilerine erişilemiyor.")
                    }
                } catch (error) {
                    console.log("error", error)
                }
            }
        }
        check()
    }, [token])

    const closeScreen = () => {
        setScreen({ action: false })
    }
    if (screen.action) {
        return ims.getComponent(screen.state, props.config, closeScreen)
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







