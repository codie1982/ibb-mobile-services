"use strict"

import Model from "ibb-mobile-services/src/library/models/model";

export default class Settings {
    constructor() {
        return true;
    }
    URL;
    PORT;
    baseurl;
    APIURL;
    VERURL;
    initialization;
    representation;
    representation_finishdownload;
    representation_install;
    seturl;
    tokenurl;
    versionurl;
    closeversion;
    deviceInfo;
    tokenModel;
    netState;
    VER = "v1"
    TOPOINT = ":"
    SLAH = "/"
    API = "api"
    NPM = "npm"
    MOBILE = "mobile"
    ENDPOINT
    MAINPORT

    setSettings = (config, application_uuid, netState) => {
        return new Promise((resolve, reject) => {
            (async () => {
                const RNDI = this.getRNDIPackage(config)
                //const NETINFO = this.getNETINFOPackage(config)
                //react-native-device-info paketi olmadan işleme devam edemiyoruz.
                if (RNDI == null) return reject("RN Device Info paketi ekli değil");
                const model = new Model(RNDI)
                this.URL = config.url;
                this.baseurl = `${this.URL}`;
                this.api = `${this.baseurl}${this.SLAH}${this.API}${this.SLAH}${this.NPM}${this.SLAH}${this.VER}${this.SLAH}${this.NPM}${this.SLAH}`;
                this.tokenurl = this.api.concat("gettoken");
                this.isDeviceRegister = this.api.concat("isdeviceregister");
                this.initialization = this.api.concat("initialization");
                this.representation = this.api.concat("representation");
                this.representation_finishdownload = this.api.concat("representation/finishdownload");
                this.representation_install = this.api.concat("representation/install");
                this.versionurl = this.api.concat("version");
                this.closeversion = this.api.concat("version/close");
                this.tokenmodel = await model.setTokenModel(application_uuid)
                this.deviceid = await model.getDeviceID()
                this.verison_number = await model.getVersionNumner()
                this.netState = netState.details
                this.packages = config.packages
                resolve({
                    url: {
                        base: this.baseurl,
                        token: this.tokenurl,
                        initialization: this.initialization,
                        isDeviceRegister: this.isDeviceRegister,
                        representation: {
                            new: this.representation,
                            finish: this.representation_finishdownload,
                            install: this.representation_install
                        },
                    },
                    model: {
                        token: this.tokenmodel,
                    },
                    device: {
                        device_id: this.deviceid,
                        verison_number:this.verison_number
                    },
                    netinfo: this.netState,
                    packages: this.packages
                })
            })()
        })
    }
    getRNDIPackage = (config) => {
        return config.packages.RNDeviceInfo
    }
    getNETINFOPackage = (config) => {
        return config.packages.NetInfo
    }
}