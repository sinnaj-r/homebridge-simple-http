"use strict";
var SimpleHTTPSwitch_1 = require("./SimpleHTTPSwitch");
module.exports = function (homebridge) {
    var hap = homebridge.hap;
    Service = hap.Service;
    Characteristic = hap.Characteristic;
    homebridge.registerAccessory("homebridge-http-simple-switch", "SimpleHttpSwitch", SimpleHTTPSwitch_1["default"]);
};
