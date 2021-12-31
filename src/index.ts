import { createAppletContainer } from "lib/AppletContainer"
import { createAppletIcon } from "lib/AppletIcon"
import { createTooltip } from "lib/Tooltip"

const { uiGroup } = imports.ui.main
const { IconType } = imports.gi.St
const { PanelLoc } = imports.ui.panel

export function main(): imports.ui.applet.Applet {

    const panel = __meta.panel
    const { monitor, panelPosition } = panel

    const isHoricontal = [PanelLoc.top, PanelLoc.bottom].includes(panelPosition)
    const isVertical = !isHoricontal

    const getTooltipTopForApplet = (props: { tooltip: imports.gi.St.Label }) => {

        const { tooltip } = props

        const naturalHeight = tooltip.get_preferred_size()[3] || 0

        global.log('isVertical', isVertical)

        if (isVertical) {
            global.log('isVertical')
            return global.get_pointer()[1]
        }

        if (panelPosition === PanelLoc.top) {
            return monitor.y + panel.actor.height
        }

        // panelLoc = bottom
        return monitor.y + monitor.height - (naturalHeight || 0) - panel.actor.height
    }

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
        visible: false
    })

    uiGroup.add_child(appletTooltip)


    appletContainer.actor.connect('enter-event', () => {
        appletTooltip.set_position(0, getTooltipTopForApplet({ tooltip: appletTooltip }))
        appletTooltip.show()
        return true
    })

    appletContainer.actor.connect('leave-event', () => {
        appletTooltip.hide()
        return true
    })

    // appletTooltip.raise_top()

    return appletContainer
}