const { Icon } = imports.gi.St

export function createIcon() {
    const icon = new Icon({
        icon_name: 'dummy'
    })

    return icon
}