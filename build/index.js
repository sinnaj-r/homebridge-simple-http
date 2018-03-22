"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
var SimpleHTTPSwitch_1 = __importDefault(require("./SimpleHTTPSwitch"));
module.exports = function (homebridge) {
    var hap = homebridge.hap;
    global.Service = hap.Service;
    global.Characteristic = hap.Characteristic;
    homebridge.registerAccessory("homebridge-http-simple-switch", "SimpleHttpSwitch", SimpleHTTPSwitch_1.default);
};
//# sourceMappingURL=index.js.map