import SimpleHTTPSwitch from "./SimpleHTTPSwitch"

export = function(homebridge: any) {
    var hap = homebridge.hap
    var Service = hap.Service
    var Characteristic = hap.Characteristic
    homebridge.registerAccessory(
        "homebridge-http-simple-switch",
        "SimpleHttpSwitch",
        SimpleHTTPSwitch
    )
}
