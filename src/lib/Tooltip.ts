const { Label } = imports.gi.St
const { uiGroup } = imports.ui.main
const { Settings } = imports.gi.Gio

type LabelProps = ConstructorParameters<typeof Label>[0]

type Props = LabelProps & {
    monitor: number
}

export function createTooltip(props: Props) {

    const {monitor, ...labelProps} = props

    const tooltip = new Label(labelProps)

    // TODO: replace with add-child
    uiGroup.add_actor(tooltip)
    const desktopSettings = new Settings({
        schema_id: 'org.cinnamon.desktop.interface'
    })

    


}