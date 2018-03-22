"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var request = require("request-promise-native");
var SimpleHTTPSwitch = /** @class */ (function () {
    function SimpleHTTPSwitch(log, config) {
        this.log = log;
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
        this.status_url = config["status_url"] || false;
        this.set_on_url = config["set_on_url"];
        this.set_off_url = config["set_off_url"];
        // HTTP Stuff
        this.http_method = config["http_method"] || "GET";
        // State Stuff
        this.on_if_this = config["on_if_this"];
        this.off_if_this = config["off_if_this"];
        // Polling Stuff
        this.polling = config["polling"] || false;
        this.pollingInterval = parseInt(config["pollingInterval"] || 5, 10); // In Seconds
        this.on_if_this_fn =
            config["on_if_this_fn"] && eval(config["on_if_this_fn"]);
        // General
        this.name = config["name"];
    }
    SimpleHTTPSwitch.prototype.makeRequest = function (url) {
        return request(url, {
            method: this.http_method,
            json: true
        });
    };
    SimpleHTTPSwitch.prototype.getPowerState = function (callback) {
        var _this = this;
        if (!this.status_url) {
            callback(null, false);
        }
        this.makeRequest(this.status_url)
            .then(function (res) {
            var ret = res;
            var retString = JSON.stringify(ret);
            if (_this.on_if_this_fn) {
                var onStatus = _this.on_if_this_fn(ret);
                if (onStatus !== null) {
                    callback(null, onStatus);
                    _this.log("[" + _this.name + "] HTTP power state get function succeeded! (" + retString + ")");
                    return;
                }
                callback(Error("Status not known"));
                return;
            }
            if (retString == JSON.stringify(_this.on_if_this)) {
                callback(null, true);
            }
            else if (retString == JSON.stringify(_this.off_if_this)) {
                callback(null, false);
            }
            else {
                callback(Error("Status not known"));
            }
            _this.log("[" + _this.name + "] HTTP power state get function succeeded! (" + retString + ")");
        })
            .catch(function (err) {
            _this.log("[" + _this.name + "] HTTP power power state get function failed! (" + err + ")");
            callback(err);
        });
    };
    SimpleHTTPSwitch.prototype.getServices = function () {
        var informationService = new Service.AccessoryInformation();
        informationService
            .setCharacteristic(Characteristic.Manufacturer, "Dock51 UG")
            .setCharacteristic(Characteristic.Model, "Dock51 HTTP Switch")
            .setCharacteristic(Characteristic.SerialNumber, "de.dock51.mk1");
        this.switchService = new Service.Switch();
        if (this.status_url) {
            this.switchService
                .getCharacteristic(Characteristic.On)
                .on("get", this.getPowerState.bind(this))
                .on("set", this.setPowerState.bind(this));
        }
        else {
            this.switchService
                .getCharacteristic(Characteristic.On)
                .on("set", this.setPowerState.bind(this));
        }
        if (this.polling) {
            this.statePolling();
        }
        return [this.switchService];
    };
    SimpleHTTPSwitch.prototype.statePolling = function () {
        clearTimeout(this.pollingTimeOut);
        this.log("[" + this.name + "] POLLING STATUS");
        this.switchService.getCharacteristic(Characteristic.On).getValue();
        this.pollingTimeOut = setTimeout(this.statePolling.bind(this), this.pollingInterval * 1000);
    };
    SimpleHTTPSwitch.prototype.setPowerState = function (powerOn, callback) {
        var _this = this;
        var body;
        this.makeRequest(powerOn ? this.set_on_url : this.set_off_url)
            .then(function (res) {
            _this.log("[" + _this.name + "] HTTP power function succeeded! (" + JSON.stringify(res) + ")");
            callback();
        })
            .catch(function (err) {
            _this.log("HTTP power function failed");
            callback(err);
        });
    };
    SimpleHTTPSwitch.prototype.identify = function (callback) {
        this.log("Identify requested!");
        callback(); // success
    };
    return SimpleHTTPSwitch;
}());
exports.default = SimpleHTTPSwitch;
//# sourceMappingURL=SimpleHTTPSwitch.js.map