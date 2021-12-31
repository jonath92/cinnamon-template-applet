import { createAppletContainer } from "lib/AppletContainer"
import { createAppletIcon } from "lib/AppletIcon"
import { createTooltip } from "lib/Tooltip"

const { uiGroup } = imports.ui.main
const { IconType } = imports.gi.St

export function main(): imports.ui.applet.Applet {

    const appletContainer = createAppletContainer()

    const appletIcon = createAppletIcon({
        icon_type: IconType.SYMBOLIC,
        icon_name: 'computer'
    })

    appletContainer.actor.add_child(appletIcon)

    const transformed = appletContainer.actor.get_transformed_position()

    const appletTooltip = createTooltip({
        text: 'my tooltip',
        getAbsolutePosition: () => appletContainer.actor.get_transformed_position(),
        visible: true
    })

    uiGroup.add_child(appletTooltip)

    // appletTooltip.raise_top()

    return appletContainer
}