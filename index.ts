import request = require("request-promise-native");


class SimpleHTTPSwitch {
    status_url: string;
    set_on_url: string;
    set_off_url: string;
    on_if_this: string;
    off_if_this: string;
    log: any;
    http_method: any;
    sendimmediately: any;
    default_state_off: any;
    name: any;
    constructor(log:any, config:any){
        this.log = log;
        /*
            example_config = {
                "url":"http://"
            }
        */

        // URLs
        this.status_url = config["status_url"];
        this.set_on_url = config["set_on_url"];
        this.set_off_url = config["set_off_url"];

        // HTTP Stuff
        this.http_method = config["http_method"];
        
        // State Stuff
        this.on_if_this = config["on_if_this"];
        this.off_if_this = config["off_if_this"];

        this.sendimmediately = config["sendimmediately"];

        // General
        this.name = config["name"];
    }
    makeRequest(url:string){
        return request(url,{
            method:this.http_method,
            json:true
        })
    }
    getPowerState(callback:(error:Error | null, state? :boolean)=>null) {
        this.makeRequest(this.status_url)
        .then((res)=>{
            let ret = JSON.parse(res.body)
            if(ret == this.on_if_this){
                callback(null, true);
            }
            else if (ret == this.off_if_this){
                callback(null, false)
            }
            else {
                callback(Error("Status not known"))
            }
            this.log(`[${this.name}] HTTP power function succeeded! (${res.body})`);
            
        })
        .catch((err)=>{
            this.log(`[${this.name}] HTTP power function failed! (${err})`);
            callback(err);
        })
    }
    getServices() {
        let  informationService = new Service.AccessoryInformation();

        informationService
            .setCharacteristic(Characteristic.Manufacturer, "Dock51 UG")
            .setCharacteristic(Characteristic.Model, "Dock51 HTTP Switch")
            .setCharacteristic(Characteristic.SerialNumber, "de.dock51.mk1");

        let switchService = new Service.Switch();
        switchService
            .getCharacteristic(Characteristic.On)
            .on('get', this.getPowerState.bind(this))
            .on('set', this.setPowerState.bind(this));

        return [ switchService ];
    }

    setPowerState(powerOn:boolean, callback:(error?:Error)=>void) {
        let body;

        this.makeRequest(powerOn ? this.set_on_url : this.set_off_url)
        .then((res)=>{
            this.log(`[${this.name}] HTTP power function succeeded! (${res.body})`);
            callback();
        })
        .catch((err)=>{
            this.log('HTTP power function failed');
            callback(err);
        })
    }
    identify(callback:(error?:Error)=>void) {
        this.log("Identify requested!");
        callback(); // success
    }
}

var Service:any, Characteristic:any;
export function exporter (homebridge:any) {
    let hap = homebridge.hap
    Service = hap.Service;
    Characteristic = hap.Characteristic;
    homebridge.registerAccessory("homebridge-http-simple-switch", "SimpleHttpSwitch", SimpleHTTPSwitch);
}