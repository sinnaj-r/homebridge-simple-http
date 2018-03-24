import SimpleHTTPSwitch from "./SimpleHTTPSwitch"

let example_config = {
    status_url: "http://localhost:8081/status/power_stat",
    set_on_url: "http://localhost:8081/send/KEY_POWER",
    set_off_url: "http://localhost:8081/send/KEY_POWER2",
    on_if_this_fn: "(obj)=>obj.status ? obj.status=='ON' : null",
    name: "Device"
}

let SHS = new SimpleHTTPSwitch(
    (str: string) => console.log(str),
    example_config
)
SHS.getPowerState((err, state) => {
    console.log("State:", state)
    SHS.setPowerState(false, err => console.log(err))
})

setTimeout(() => {
    SHS.getPowerState((err, state) => {
        console.log("State:", state)
        SHS.setPowerState(true, err => console.log(err))
    })
}, 3000)
