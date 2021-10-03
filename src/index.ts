import { getClient } from "dbus";
import { createPopupMenu } from "cinnamonpopup";
import { createActivWidget } from "lib/ActivWidget";

const { IconApplet } = imports.ui.applet
const { Label, BoxLayout } = imports.gi.St

interface Arguments {
  orientation: imports.gi.St.Side,
  panelHeight: number,
  instanceId: number
}

function createSimpleItem(text: string, onClick: () => void) {
  const popupMenuItem = new BoxLayout({
    style_class: 'popup-menu-item',
  })

  const label = new Label({
    text
  })

  popupMenuItem.add_child(label)

  createActivWidget({widget: popupMenuItem, onActivated: onClick})

  return popupMenuItem
}



export function main(args: Arguments): imports.ui.applet.Applet {

  const {
    orientation,
    panelHeight,
    instanceId
  } = args


  const myApplet = new IconApplet(orientation, panelHeight, instanceId)

  const popupMenu = createPopupMenu({ launcher: myApplet.actor })


  const startUrlItem = createSimpleItem('start url', async () => {
    const client = await getClient()
    // @ts-ignore
    client.ComplexMethodRemote('test')
  }) 

  popupMenu.add_child(startUrlItem)

  myApplet.set_applet_icon_symbolic_name('computer')
  myApplet.on_applet_clicked = popupMenu.toggle

  return myApplet
}