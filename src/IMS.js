import React from 'react'
import Version from "./component/version"
import Test from "./component/test"
import Error from "./component/error"
import io from 'socket.io-client';
import Settings from "ibb-mobile-services/src/Lib/models/settings"
import Model from "ibb-mobile-services/src/Lib/models/model"
import Request from "./Lib/http"
export default class IMS {
    constructor(config) {
        (async () => {
            const settings = new Settings();
            this.settings = await settings.setSettings(config)
            this.token;
            this.applicationId;
            this.model = {}
            this.deviceModel = {}
            this.versionModel = {}
            this.newVersion = false
            //Soket Bağlantısı
            this.socket = io(`${this.settings.base_url}`);
        })()
    }
    /**
       * Servisden Token almak için
       * @param {string} application_uuid 
       */
    getApplicationInfo() {
        return new Promise((resolve, reject) => {
            (async () => {
                if (application_uuid == "" || typeof application_uuid == "undefined") reject({ message: "Uygulama ID'si Tanımsız" })
                const model = new Model;
                let initModel = await model.createInitModel(application_uuid)
                const request = new Request;
                let response = await request.send(this.settings.token_url, initModel)
                resolve(response.token)
            })()
        })
    }
    /**
       * Servisden Token almak için
       * @param {string} application_uuid 
       */
    getToken(application_uuid) {
        return new Promise((resolve, reject) => {
            (async () => {
                if (application_uuid == "" || typeof application_uuid == "undefined") reject({ message: "Uygulama ID'si Tanımsız" })
                const model = new Model;
                let initModel = await model.createInitModel(application_uuid)
                const request = new Request;
                let response = await request.send(this.settings.token_url, initModel)
                resolve({ token: response.token, model: initModel })
            })()
        })
    }
    /**
     * Uygulama Socket bağlantısı gerçekleşiyor.
     * @param {string} application_uuid 
     */
    init(application_uuid) {
        return new Promise((resolve, reject) => {
            (async () => {
                const model = new Model;
                let initModel = await model.createInitModel(application_uuid)
                this.socket.emit("active_connection", JSON.stringify(initModel))
                this.socket.on("application_info", (application) => {
                    if (application.success) {
                        resolve(application.info)
                    } else {
                        reject(application)
                    }
                })
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
                //model.applicationId = applicationId
                this.model = model
                resolve(true)
            })()
        })
    }
    setDeviceModel() {
        return new Promise((resolve, reject) => {
            (async () => {
                const model = new Model;
                this.deviceModel = await model.createDeviceModel()
                resolve(this.deviceModel)
            })()
        })
    }
    setVersionModel(application_info) {
        return new Promise((resolve, reject) => {
            (async () => {
                const model = new Model;
                let versionModel = await model.createVersionModel(application_info)
                this.versionModel = versionModel
                resolve(versionModel)
            })()
        })
    }

    /**
    * Cihazı Kayıt Etmek için
    */
    setDevice(token) {
        return new Promise((resolve, reject) => {
            (async () => {
                const model = new Model;
                let deviceModel = await model.createDeviceModel()
                const request = new Request;
                await request.send(this.settings.init_url, deviceModel, token)
                resolve(true)
            })()
        })
    }


    async setState(application_info, token) {
        const versionModel = await this.setVersionModel(application_info)
        //console.log("versionModel",versionModel)
        console.log("this.settings.version_url", this.settings.version_url)
        if (typeof this.settings.version_url != "undefined") {
            const request = new Request;
            const data = await request.send(this.settings.version_url, versionModel, token).catch(err => {
                console.log("ERROR State", err)
            })
            if (typeof data.result != "undefined")
                return data.result
        }
        return false
    }

    getComponent(state, config, closeCallback) {
        if (state.type == "error") {
            return <Error component={state.component} message={state.message} config={config} />
        } else {
            switch (state.component) {
                case "new_version":
                    return <Version detail={state.version} message={state.message} close={closeCallback} config={config} />
                case "test_version":
                    return <Test detail={state.version} message={state.message} close={closeCallback} config={config} />
                case "no_version":
                    return <Error message={state.message} config={config} />
                case "delete_application":
                    return <Error message={state.message} config={config} />
                default:
                    return <Error message={state.message} config={config} />
            }
        }
    }
}