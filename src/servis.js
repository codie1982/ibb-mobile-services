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
                let response = await request.send(this.settings.url.token, this.settings.model.token).catch(err=>console.log("HATA",err))
                resolve({ accessToken: response.accessToken, refreshToken: response.refreshToken, isDeviceRegister: response.isDeviceRegister })
            })()
        })
    }
    /**
     * Uygulama Socket bağlantısı gerçekleşiyor.
     * @param {string} application_uuid 
     */
    initialization(application_uuid, token, register) {
        return new Promise((resolve, reject) => {
            (async () => {
                if (application_uuid == "" || typeof application_uuid == "undefined") reject({ message: "Uygulama ID'si Tanımsız" })
                const request = new Request;
                let nModel = await new Model(this.settings.packages.RNDeviceInfo)
                this.settings.model.version = await nModel.setVersionModel()
                register ? this.settings.model.register = await nModel.setRegisterModel(false) : null

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
       * Uygulama bilgilerini girmek
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
        /*   const versionModel = await this.setVersionModel(application_info)
          //console.log("versionModel",versionModel)
          if (typeof this.settings.version_url != "undefined") {
              const request = new Request;
              const data = await request.send(this.settings.version_url, versionModel, token).catch(err => {
                  console.log("ERROR State", err)
              })
              if (typeof data.result != "undefined")
                  return data.result
          } */
        return false
    }
    //screen.component, screen.type, screen.detail, screen.message, screen.application, token, closeScreen
    getComponent(component, type, publish_version, message, application, token, closeCallback) {
        if (type == "error") {
            return <Error component={state.component} message={message} />
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