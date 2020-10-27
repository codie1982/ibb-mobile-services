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
        this.applicationId;
        this.model = {}
        this.deviceModel = {}
        this.versionModel = {}
        this.newVersion = false
    }

    /**
* 
* @param {Object} config 
*/
    async setSettings(config) {
        const settings = new Settings();
        this.settings = await settings.setSettings(config)
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
                //model.applicationId = applicationId
                console.log("model", model)
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
            const socket = io(`${this.settings.base_url}`);
            const modelObject = this.model
            socket.emit("active_connection", JSON.stringify(modelObject))

            socket.on("getToken", (token) => {
                this.token = token
                resolve(token)
            })

            socket.on("setDevice", async (isSetDevice) => {
                if (isSetDevice) {
                    const data = await this.setDeviceModel()
                    this.send(this.settings.init_url, data, this.token)
                }
                resolve(true)
            })
        })
    }

    async send(url, data, token) {
        const config = this.createHeader(data, token)
        if (typeof url != "undefined" && typeof token != "undefined") {
            const response = await fetch(url, config)
            const version = await response.json()
            return version
        }else {
            return false
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
        const versionModel = await this.setVersionModel(application_uuid)
        //console.log("versionModel",versionModel)
        const data = await this.send(this.settings.version_url, versionModel, token) 
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
            default:
                return <Version />
        }
    }
}