import { createAppletContainer } from "lib/AppletContainer"
import { createAppletIcon } from "lib/AppletIcon"

const { IconType } = imports.gi.St

declare global {
    // added during build (see webpack.config.js)
    interface Meta {
        instanceId: number
        orientation: imports.gi.St.Side
        panel: imports.ui.panel.Panel
        locationLabel: imports.ui.appletManager.LocationLabel
    }
}

export function main(): imports.ui.applet.Applet {

    const appletContainer = createAppletContainer()

    const appletIcon = createAppletIcon({
        icon_type: IconType.SYMBOLIC,
        icon_name: 'computer'
    })

    appletContainer.actor.add_child(appletIcon)

    return appletContainer
}