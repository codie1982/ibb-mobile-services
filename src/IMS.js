import React from 'react'
import Version from "./component/version"
import Test from "./component/test"
import Error from "./component/error"
import io from 'socket.io-client';
import Settings from "./Lib/models/Settings"
import DeviceModel from "./Lib/models/DeviceModel"
export default class IMS {
    constructor() {
        this.token;
        this.application_uuid;
        this.model = {}
        this.deviceModel = {}
        this.versionModel = {}
        this.newVersion = false
        this.settings = {}
    }
    /**
  * 
  * @param {Object} config 
  */
    setSettings(config) {
        return new Promise((resolve, reject) => {
            (async () => {
                const settings = new Settings();
                this.settings = await settings.setSettings(config)
                console.log("this.settings",this.settings)
                // settings.createSettings()
            })()
        })
    }

    /**
     * 
     * @param {String} application_uuid 
     */
    setApplicationModel(application_uuid) {
        return new Promise((resolve, reject) => {
            (async () => {
                const deviceModel = new DeviceModel;
                let model = await deviceModel.createInitModel(application_uuid)
                this.model = model
                resolve(true)
            })()
        })
    }
    setDeviceModel() {
        return new Promise((resolve, reject) => {
            (async () => {
                const deviceModel = new DeviceModel;
                let model = await deviceModel.createDeviceModel()
                this.deviceModel = model
                resolve(this.deviceModel)
            })()
        })
    }
    setVersionModel(application_uuid) {
        return new Promise((resolve, reject) => {
            (async () => {
                const deviceModel = new DeviceModel;
                let versionModel = await deviceModel.createVersionModel()
                versionModel.application_uuid = application_uuid
                this.versionModel = versionModel
                resolve(this.versionModel)
            })()
        })
    }
    init() {
        return new Promise((resolve, reject) => {
            const socket = io(`${settings.URL}:${settings.PORT}`);
            const modelObject = this.model
            socket.emit("active_connection", JSON.stringify(modelObject))
            socket.on("getToken", (token) => {
                this.token = token
                resolve(token)
            })

            socket.on("setDevice", async (isSetDevice) => {
                if (isSetDevice) {
                    const data = await this.setDeviceModel()
                    //`${baseUrl}:${MAINPORT}/api/mobile/v1/init`;
                    this.send(settings.INITURL, data, this.token)
                }
                resolve(true)
            })
        })
    }

    async send(url, data, token) {
        const config = this.createHeader(data, token)
        if (typeof url != "undefined" && typeof token != "undefined") {
            const response = await fetch(url, config)
            console.log("response", response)
            const version = await response.json()
            return version
        }
        //.catch(err => console.log("err", url, { err }))
    }

    createHeader(data, token) {
        return {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
                'Content-Type': 'application/json',
                'authorization': `Baerer ` + token
            },
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
            body: JSON.stringify(data) // body data type must match "Content-Type" header
        }
    }
    async setState(application_uuid, token) {
        console.log("application_uuid, token", application_uuid, token)
        const versionModel = await this.setVersionModel(application_uuid)
        console.log("versionModel", versionModel, settings.STATEURL)
        const data = await this.send(settings.STATEURL, versionModel, token)
        if (typeof data.result != "undefined")
            return data.result
        return false
    }

    getComponent(state, closeCallback) {
        switch (state.component) {
            case "new_version":
                return <Version detail={state.version} message={state.message} close={closeCallback} />
            case "test_version":
                return <Test detail={state.version} message={state.message} close={closeCallback} />
            case "no_version":
                return <Error message={state.message} />
            case "no_application":
                return <Error message={state.message} />
            default:
                return <Version />
        }
    }
}