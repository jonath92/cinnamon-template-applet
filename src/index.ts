import { Service } from "dbus-service"

const { IconApplet } = imports.ui.applet


interface Arguments {
    orientation: imports.gi.St.Side,
    panelHeight: number,
    instanceId: number
}

export function main(args: Arguments): imports.ui.applet.Applet {

    const {
        orientation,
        panelHeight,
        instanceId
    } = args

    const service = new Service()

    const myApplet = new IconApplet(orientation, panelHeight, instanceId)

    myApplet.set_applet_icon_symbolic_name('computer')
    myApplet.on_applet_clicked = () => global.log('applet clicked')

    return myApplet
}