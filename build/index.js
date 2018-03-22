"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
var SimpleHTTPSwitch_1 = __importDefault(require("./SimpleHTTPSwitch"));
var Service, Characteristic;
module.exports = function (homebridge) {
    var hap = homebridge.hap;
    Service = hap.Service;
    Characteristic = hap.Characteristic;
    homebridge.registerAccessory("homebridge-http-simple-switch", "SimpleHttpSwitch", SimpleHTTPSwitch_1.default);
};
//# sourceMappingURL=index.js.map