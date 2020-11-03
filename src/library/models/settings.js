"use strict"
export default class Settings {
    constructor() {
        return true;
    }
    URL;
    PORT;
    baseurl;
    APIURL;
    VERURL;
    initurl;
    seturl;
    tokenurl;
    versionurl;
    closeversion;
    VER = "v1"
    TOPOINT = ":"
    SLAH = "/"
    API = "api"
    MOBILE = "mobile"
    ENDPOINT
    MAINPORT
    setSettings = (config) => {
        return new Promise((resolve, reject) => {
            this.URL = config.url;
            this.MAINPORT = config.port;
            this.baseurl = `${this.URL}${this.TOPOINT}${this.MAINPORT}`;
            this.APIURL = `${this.baseurl}${this.SLAH}${this.API}${this.SLAH}${this.MOBILE}`;
            this.seturl = `${this.APIURL}${this.SLAH}${this.VER}/set`;
            this.tokenurl = `${this.APIURL}${this.SLAH}${this.VER}/token`;
            this.initurl = `${this.APIURL}${this.SLAH}${this.VER}/init`;
            this.versionurl = `${this.APIURL}${this.SLAH}${this.VER}/version`;
            this.closeversion = `${this.APIURL}${this.SLAH}${this.VER}/version/close`;
            
            resolve({
                base_url: this.baseurl,
                token_url: this.tokenurl,
                set_url: this.seturl,
                init_url: this.initurl,
                version_url: this.versionurl,
                close_version: this.closeversion
            })
        })
    }
}

/* const createSettings = () => {
    //let baseUrl = "http://192.168.1.5";
    //let baseUrl = "http://192.168.43.72";
    set(){

    }
    let baseUrl = "http://10.4.240.65";
    const MAINPORT = 3434;

    const VER = "v1"
    const BASEURL = `${baseUrl}:${MAINPORT}`;
    const INITURL = `${baseUrl}:${MAINPORT}/api/mobile/${VER}/init`;
    const STATEURL = `${baseUrl}:${MAINPORT}/api/mobile/${VER}/version`;
    const CLOSEVERSION = `${baseUrl}:${MAINPORT}/api/mobile/${VER}/version/close`;
    return {
        URL: baseUrl,
        PORT: MAINPORT,
        BASEURL,
        INITURL, STATEURL, CLOSEVERSION
    };
};

export let settings = createSettings(); */