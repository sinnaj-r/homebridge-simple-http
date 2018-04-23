"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
Object.defineProperty(exports, "__esModule", { value: true });
var request_promise_native_1 = __importDefault(require("request-promise-native"));
var SimpleHTTPSwitch = /** @class */ (function () {
    function SimpleHTTPSwitch(log, config) {
        this.log = log;
        // URLs
        this.status_url = config["status_url"] || false;
        this.set_on_url = config["set_on_url"];
        this.set_off_url = config["set_off_url"];
        // HTTP Stuff
        this.http_method = config["http_method"] || "GET";
        this.ignore_https_security = config["ignore_https_security"] || false;
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
        if (this.ignore_https_security == true) {
            var agentOptions = {
                rejectUnauthorized: false
            };
            return request_promise_native_1.default({
                url: url,
                agentOptions: agentOptions,
                method: this.http_method,
                json: true
            });
        }
        else {
            return request_promise_native_1.default(url, {
                method: this.http_method,
                json: true
            });
        }
    };
    SimpleHTTPSwitch.prototype.getPowerState = function (callback) {
        var _this = this;
        if (!this.status_url) {
            callback(null, false);
            return;
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
            .setCharacteristic(Characteristic.Manufacturer, "SimpleHTTPSwitch Manufacturer")
            .setCharacteristic(Characteristic.Model, "Simple HTTP Switch")
            .setCharacteristic(Characteristic.SerialNumber, "de.jannisrosenbaum.SimpleHTTPSwitch");
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
                .on("get", this.getPowerState.bind(this))
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
        var uri = powerOn ? this.set_on_url : this.set_off_url;
        uri = this.status_url ? uri : this.set_on_url;
        this.makeRequest(uri)
            .then(function (res) {
            _this.log("[" + _this.name + "] HTTP power function succeeded! (" + JSON.stringify(res) + ")");
            if (!_this.status_url) {
                setTimeout(function () {
                    return _this.switchService
                        .getCharacteristic(Characteristic.On)
                        .getValue();
                }, 300);
            }
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