"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
Object.defineProperty(exports, "__esModule", { value: true });
var SimpleHTTPSwitch_1 = __importDefault(require("./SimpleHTTPSwitch"));
var example_config = {
    status_url: "http://localhost:8081/status/power_stat",
    set_on_url: "http://localhost:8081/send/KEY_POWER",
    set_off_url: "http://localhost:8081/send/KEY_POWER2",
    on_if_this_fn: "(obj)=>obj.status ? obj.status=='ON' : null",
    name: "Device"
};
var SHS = new SimpleHTTPSwitch_1.default(function (str) { return console.log(str); }, example_config);
SHS.getPowerState(function (err, state) {
    console.log("State:", state);
    SHS.setPowerState(false, function (err) { return console.log(err); });
});
setTimeout(function () {
    SHS.getPowerState(function (err, state) {
        console.log("State:", state);
        SHS.setPowerState(true, function (err) { return console.log(err); });
    });
}, 3000);
//# sourceMappingURL=test.js.map