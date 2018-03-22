import { SimpleHTTPSwitch } from "./index"

let example_config = {
    status_url: "http://192.168.1.14:8081/status/power_stat",
    set_on_url: "http://192.168.1.14:8081/send/KEY_POWER",
    set_off_url: "http://192.168.1.14:8081/send/KEY_POWER2",
    //on_if_this: {status:"ON"},
    //off_if_this: {status:"OFF"},
    on_if_this_fn: "(obj)=>obj.status ? obj.status=='ON' : null",
    name: "Anlage"
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
