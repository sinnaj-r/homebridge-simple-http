import SimpleHTTPSwitch from "./SimpleHTTPSwitch"

declare var Service: any
declare var Characteristic: any
export = function(homebridge: any) {
    let hap = homebridge.hap
    Service = hap.Service
    Characteristic = hap.Characteristic
    homebridge.registerAccessory(
        "homebridge-http-simple-switch",
        "SimpleHttpSwitch",
        SimpleHTTPSwitch
    )
}
