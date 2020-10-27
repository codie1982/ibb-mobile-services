const createSettings = () => {
    let baseUrl = "http://192.168.1.5";
    //let baseUrl = "http://192.168.43.72";
    //let baseUrl = "http://10.4.240.65";
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
        INITURL,STATEURL,CLOSEVERSION
    };
};
;
export let settings = createSettings();