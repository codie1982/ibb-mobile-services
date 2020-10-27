"use strict"
export default class Settings {
    constructor() {
        return true;
    }
    URL;
    PORT;
    BASEURL;
    APIURL;
    VERURL;
    INITURL; STATEURL; CLOSEVERSION;
    VER = "v1"
    TOPOINT = "/"
    SLAH = "/"
    API = "api"
    MOBILE = "mobile"
    ENDPOINT
    MAINPORT
    setSettings = async (config) => {
        this.ENDPOINT = config.endpoint;
        this.MAINPORT = config.port;
        this.BASEURL = `${this.ENDPOINT}${this.TOPOINT}${this.MAINPORT}`;
        this.APIURL = `${this.BASEURL}${this.SLAH}${this.API}${this.SLAH}${this.MOBILE}`;
        this.VERURL = `${this.APIURL}${this.SLAH}${this.VER}`;
        this.INITURL = `${this.VERURL}/init`;
        this.STATEURL = `${this.VERURL}/version`;
        this.CLOSEVERSION = `${this.VERURL}/version/close`;
        return {
            URL: this.ENDPOINT,
            PORT: this.MAINPORT,
            BASEURL: this.BASEURL,
            INITURL: this.INITURL,
            STATEURL: this.STATEURL,
            CLOSEVERSION: this.CLOSEVERSION
        }
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