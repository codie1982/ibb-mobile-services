export default class Request {
    constructor() {
        return true
    }
    send(url, data, token) {
        return new Promise((resolve, reject) => {
            (async () => {
                const config = this.createHeader(data, token)
             
                if (typeof url != "undefined") {
                    const response = await fetch(url, config)
                    const result = await response.json()
                    resolve(result)
                } else {
                    reject({ url: url, data, message: "request error" })
                }
            })()
        })
    }
    createHeader(data, token) {
        const header = {}
        header["method"] = "POST" // *GET, POST, PUT, DELETE, etc.
        header["mode"] = 'cors'   // no-cors, *cors, same-origin
        header["cache"] = 'no-cache' // *default, no-cache, reload, force-cache, only-if-cached
        header["credentials"] = 'same-origin' // include, *same-origin, omit
        if (typeof token != "undefined") {
            header["headers"] = {
                'Content-Type': 'application/json',
                'authorization': `Baerer ` + token
            }
        } else {
            header["headers"] = {
                'Content-Type': 'application/json',
            }
        }
        header["redirect"] = 'follow' // manual, *follow, error
        header["referrerPolicy"] = 'no-referrer' // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        header["body"] = JSON.stringify(data) // body data type must match "Content-Type" header
        return header

        /**
         * {
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
         */
    }
}

