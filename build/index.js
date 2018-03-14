"use strict"
Object.defineProperty(exports, "__esModule", { value: true })
var request = require("request-promise-native")
var SimpleHTTPSwitch = /** @class */ (function() {
    function SimpleHTTPSwitch(log, config) {
        this.log = log
        /*
            example_config = {
                "url":"http://"
            }
        */
        // URLs
        this.status_url = config["status_url"]
        this.set_on_url = config["set_on_url"]
        this.set_off_url = config["set_off_url"]
        // HTTP Stuff
        this.http_method = config["http_method"]
        // State Stuff
        this.on_if_this = config["on_if_this"]
        this.off_if_this = config["off_if_this"]
        this.sendimmediately = config["sendimmediately"]
        // General
        this.name = config["name"]
    }
    SimpleHTTPSwitch.prototype.makeRequest = function(url) {
        return request(url, {
            method: this.http_method,
            json: true
        })
    }
    SimpleHTTPSwitch.prototype.getPowerState = function(callback) {
        var _this = this
        this.makeRequest(this.status_url)
            .then(function(res) {
                var ret = JSON.parse(res.body)
                if (ret == _this.on_if_this) {
                    callback(null, true)
                } else if (ret == _this.off_if_this) {
                    callback(null, false)
                } else {
                    callback(Error("Status not known"))
                }
                _this.log(
                    "[" +
                        _this.name +
                        "] HTTP power function succeeded! (" +
                        res.body +
                        ")"
                )
            })
            .catch(function(err) {
                _this.log(
                    "[" +
                        _this.name +
                        "] HTTP power function failed! (" +
                        err +
                        ")"
                )
                callback(err)
            })
    }
    SimpleHTTPSwitch.prototype.getServices = function() {
        var informationService = new Service.AccessoryInformation()
        informationService
            .setCharacteristic(Characteristic.Manufacturer, "Dock51 UG")
            .setCharacteristic(Characteristic.Model, "Dock51 HTTP Switch")
            .setCharacteristic(Characteristic.SerialNumber, "de.dock51.mk1")
        var switchService = new Service.Switch()
        switchService
            .getCharacteristic(Characteristic.On)
            .on("get", this.getPowerState.bind(this))
            .on("set", this.setPowerState.bind(this))
        return [switchService]
    }
    SimpleHTTPSwitch.prototype.setPowerState = function(powerOn, callback) {
        var _this = this
        var body
        this.makeRequest(powerOn ? this.set_on_url : this.set_off_url)
            .then(function(res) {
                _this.log(
                    "[" +
                        _this.name +
                        "] HTTP power function succeeded! (" +
                        res.body +
                        ")"
                )
                callback()
            })
            .catch(function(err) {
                _this.log("HTTP power function failed")
                callback(err)
            })
    }
    SimpleHTTPSwitch.prototype.identify = function(callback) {
        this.log("Identify requested!")
        callback() // success
    }
    return SimpleHTTPSwitch
})()
var Service, Characteristic
function exporter(homebridge) {
    var hap = homebridge.hap
    Service = hap.Service
    Characteristic = hap.Characteristic
    homebridge.registerAccessory(
        "homebridge-http-simple-switch",
        "SimpleHttpSwitch",
        SimpleHTTPSwitch
    )
}
exports.exporter = exporter
