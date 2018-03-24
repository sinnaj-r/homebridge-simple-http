# homebridge_simple_http
This Project tries to deliver a simple, but fail-safe HTTP Switch for HomeBridge

## Installation
Just install the NPM Plugin Globally
```
npm install -g homebridge-http-simple-switch
```

## Usage
Just configure the config.json as usual, the following paramteres are supported:
```
    // Switch with polling and a On/Off-State
    {
      "accessory" : "SimpleHttpSwitch",
      "set_off_url" : "http://localhost/turn/off",        // The JSON-Webservice URL for turning the device on
      "status_url" : "http://localhost/device/status",    // The JSON-Webservice URL for getting the device's status
      "on_if_this_fn" : "(obj)=>obj.status ? obj.status=='ON' : null", //JS Function for evaluating if the device is on, you can alternativly use the following:
      "on_if_this": {"status":"on"},                      // If you don't want to use on_if_this_fn
      "off_if_this": {"status":"off"},                    // If you don't want to use on_if_this_fn
      "set_on_url" : "http://localhost/turn/on",          // The JSON-Webservice URL for turning the device on
      "polling" : true,                                   // Enable Polling/Refreshing of the Status
      "pollingInterval" : 5,                              // Polling Interval in Seconds
      "name" : "Desk Light"                               // Name of your Switch/Accessory
    }

    // Stateless Switch, will automaticly go off a few miliseconds after switched on
    {
      "accessory" : "SimpleHttpSwitch",
      "set_on_url" : "http://localhost/trigger/something",
      "status_url" : "", // Needs to be empty
      "name" : "Desk Light"
    }
```

## ToDo
- publish to npm
- improve TypeScript Typings
- improve code readability
- migrate to a platform instead of a single accessory
- support other HomeKit-Accessories then 'Switch'
