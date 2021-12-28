const { Label } = imports.gi.St
const { Settings } = imports.gi.Gio

type LabelProps = ConstructorParameters<typeof Label>[0]
const { PanelLoc } = imports.ui.panel


type TooltipProps = LabelProps & {
    getAbsolutePosition: InstanceType<typeof imports.gi.Clutter.Actor>['get_transformed_position']
}

export function createTooltip(props: TooltipProps) {

    const { getAbsolutePosition, ...labelProps } = props

    const panel = __meta.panel
    const { monitor, panelPosition } = panel

    const isVertial = [PanelLoc.top, PanelLoc.bottom].includes(panelPosition)

    const tooltip = new Label({
        name: 'Tooltip', // needed for style
        ...labelProps
    })

    const getTooltipTop = () => {

        if (!isVertial) {
            return getAbsolutePosition()[1] || 0
        }

        if (panelPosition === PanelLoc.top) {
            return monitor.y + panel.actor.height
        }

        // panelLoc = bottom
        const naturalHeight = tooltip.get_preferred_size()[3]
        return monitor.y + monitor.height - (naturalHeight || 0) - panel.actor.height
    }


    global.log(`pointer: ${global.get_pointer()[0]}, topPos: ${getTooltipTop()}`)

    tooltip.set_position(global.get_pointer()[0], getTooltipTop())



    const show = () => {
        tooltip.show()

        const [minWidth, minHeight, naturalWidth, naturalHeight] = tooltip.get_preferred_size()


    }

    return tooltip



}