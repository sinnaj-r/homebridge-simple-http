import SimpleHTTPSwitch from "./SimpleHTTPSwitch"

declare var global: any
export = function(homebridge: any) {
    var hap = homebridge.hap
    global.Service = hap.Service
    global.Characteristic = hap.Characteristic
    homebridge.registerAccessory(
        "homebridge-http-simple-switch",
        "SimpleHttpSwitch",
        SimpleHTTPSwitch
    )
}
