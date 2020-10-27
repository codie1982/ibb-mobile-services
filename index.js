import React, { useState, useEffect } from 'react'
import IMS from "./src/IMS"
import PropTypes from 'prop-types';
export default function IBB(props) {
    const ims = new IMS;
    const [token, setToken] = useState()
    const [screen, setScreen] = useState({ action: false, state: {} })
    const [versionScreen, setVersionScreen] = useState(false)
    const [deviceState, setDeviceState] = useState()
    //Açıklma
    useEffect(() => {
        const start = async () => {
            await ims.setSettings(props.config)
            await ims.setApplicationModel(props.application_uuid)
            const token = await ims.init()
            setToken(token)
        }
        start()
    }, [])

    useEffect(() => {
        const check = async () => {
            const state = await ims.setState(props.application_uuid, token)
            console.log("state", state)
            setScreen({ action: state.action, state: state })
        }
        check()
    }, [token])

    const closeScreen = () => {
        setScreen({ action: false })
    }
    //console.log("screen",screen)
    if (screen.action) {
        return ims.getComponent(screen.state, closeScreen)
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







