import React from 'react'
import Version from "./component/version"
import Test from "./component/test"
import Error from "./component/error"
import Settings from "./library/models/settings"
import Model from "./library/models/model"
import Request from "./library/http"
export default class Servis {
    settings;
    constructor() {
        this.settings;
    }

    /**
     * Servis ve ayarlar 
     * @param {*} config 
     * @param {*} application_uuid 
     * @param {*} netState 
     */
    setServis = async (config, application_uuid, netState) => {
        const settings = new Settings()
            this.settings = await settings.setSettings(config, application_uuid, netState)
    }
    /**
   * Servisden Token almak için
   * @param {string} application_uuid 
   */
    getToken(application_uuid) {
        return new Promise((resolve, reject) => {
            (async () => {
                if (application_uuid == "" || typeof application_uuid == "undefined") reject({ message: "Uygulama ID'si Tanımsız" })
                const request = new Request;
                let response = await request.send(this.settings.url.token, this.settings.model.token).catch(err => console.log("HATA", err))
                resolve({ accessToken: response.accessToken, refreshToken: response.refreshToken, isDeviceRegister: response.isDeviceRegister })
            })()
        })
    }
    /**
     * uygulama ilk bağlantı kontrolü
     * @param {string} application_uuid 
     */
    initialization(application_uuid, token, register) {
        return new Promise((resolve, reject) => {
            (async () => {
                if (application_uuid == "" || typeof application_uuid == "undefined") reject({ message: "Uygulama ID'si Tanımsız" })
                const request = new Request;
                let nModel = await new Model(this.settings.packages.RNDeviceInfo)
                this.settings.model.connection = await nModel.setConnectionModel(application_uuid)
                !register ? this.settings.model.register = await nModel.setRegisterModel(false) : null

                let data = {
                    application_uuid,
                    model: this.settings.model,
                    netinfo: this.settings.netinfo,
                }
                if (token) {
                    let response = await request.send(this.settings.url.initialization, data, token) //url, data, token
                    resolve(response)
                } else {
                    reject("Token Bulunmuyor.")
                }

            })()
        })
    }

    /**
     * Servisden gelen cevaplara göre ilgili componentleri açıyor.
     * @param {*} component 
     * @param {*} type 
     * @param {*} publish_version 
     * @param {*} message 
     * @param {*} application 
     * @param {*} token 
     * @param {*} closeCallback 
     */
    getComponent(component, type, publish_version, message, application, token, closeCallback) {
        if (type == "error") {
            return <Error message={message} />
        } else {
            switch (component) {
                case "new_version":
                    return <Version
                        baseurl={this.settings.url.base}
                        publish_version={publish_version}
                        message={message}
                        application={application}
                        settings={this.settings}
                        token={token}
                        close={closeCallback} />
                case "test_version":
                    return <Test detail={publish_version} message={message} close={closeCallback} />
                case "no_version":
                    return <Error message={message} />
                case "delete_application":
                    return <Error message={message} />
                default:
                    return <Error message={message} />
            }
        }
    }
}