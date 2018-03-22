import request = require("request-promise-native")
declare var Service: any
declare var Characteristic: any

export default class SimpleHTTPSwitch {
    private polling: boolean
    private pollingInterval: number
    private pollingTimeOut: any
    private switchService: any
    private on_if_this_fn: (obj: any) => boolean | null
    private status_url: string
    private set_on_url: string
    private set_off_url: string
    private on_if_this: string
    private off_if_this: string
    private log: any
    private http_method: any
    private default_state_off: any
    private name: any
    constructor(log: any, config: any) {
        this.log = log
        /*
            example_config = {
                "status_url":"http://192.168.1.14:8081/status/power_stat",
                "set_on_url":"http://192.168.1.14:8081/send/KEY_POWER",
                "set_off_url":"http://192.168.1.14:8081/send/KEY_POWER2",
                "on_if_this": "ON",
                "off_if_this": "OFF",
                "name": "Anlage"
            }
        */

        // URLs
        this.status_url = config["status_url"]
        this.set_on_url = config["set_on_url"]
        this.set_off_url = config["set_off_url"]

        // HTTP Stuff
        this.http_method = config["http_method"] || "GET"

        // State Stuff
        this.on_if_this = config["on_if_this"]
        this.off_if_this = config["off_if_this"]

        // Polling Stuff
        this.polling = config["polling"] || false
        this.pollingInterval = parseInt(config["pollingInterval"] || 5, 10) // In Seconds

        this.on_if_this_fn =
            config["on_if_this_fn"] && eval(config["on_if_this_fn"])
        // General
        this.name = config["name"]
    }
    makeRequest(url: string) {
        return request(url, {
            method: this.http_method,
            json: true
        })
    }
    getPowerState(callback: (error: Error | null, state?: boolean) => void) {
        this.makeRequest(this.status_url)
            .then(res => {
                console.log(res)
                let ret = res
                let retString = JSON.stringify(ret)
                if (this.on_if_this_fn) {
                    let onStatus = this.on_if_this_fn(ret)
                    if (onStatus !== null) {
                        callback(null, onStatus)
                        this.log(
                            `[${
                                this.name
                            }] HTTP power state get function succeeded! (${retString})`
                        )
                        return
                    }
                    callback(Error("Status not known"))
                    return
                }
                if (retString == JSON.stringify(this.on_if_this)) {
                    callback(null, true)
                } else if (retString == JSON.stringify(this.off_if_this)) {
                    callback(null, false)
                } else {
                    callback(Error("Status not known"))
                }
                this.log(
                    `[${
                        this.name
                    }] HTTP power state get function succeeded! (${retString})`
                )
            })
            .catch(err => {
                this.log(
                    `[${
                        this.name
                    }] HTTP power power state get function failed! (${err})`
                )
                callback(err)
            })
    }
    getServices() {
        let informationService = new Service.AccessoryInformation()

        informationService
            .setCharacteristic(Characteristic.Manufacturer, "Dock51 UG")
            .setCharacteristic(Characteristic.Model, "Dock51 HTTP Switch")
            .setCharacteristic(Characteristic.SerialNumber, "de.dock51.mk1")

        this.switchService = new Service.Switch()
        this.switchService
            .getCharacteristic(Characteristic.On)
            .on("get", this.getPowerState.bind(this))
            .on("set", this.setPowerState.bind(this))
        if (this.polling) {
            this.statePolling()
        }
        return [this.switchService]
    }
    statePolling() {
        clearTimeout(this.pollingTimeOut)
        this.log(`[${this.name}] POLLING STATUS`)
        this.switchService.getCharacteristic(Characteristic.On).getValue()

        this.pollingTimeOut = setTimeout(
            this.statePolling.bind(this),
            this.pollingInterval * 1000
        )
    }
    setPowerState(powerOn: boolean, callback: (error?: Error) => void) {
        let body

        this.makeRequest(powerOn ? this.set_on_url : this.set_off_url)
            .then(res => {
                this.log(
                    `[${
                        this.name
                    }] HTTP power function succeeded! (${JSON.stringify(res)})`
                )
                callback()
            })
            .catch(err => {
                this.log("HTTP power function failed")
                callback(err)
            })
    }
    identify(callback: (error?: Error) => void) {
        this.log("Identify requested!")
        callback() // success
    }
}
