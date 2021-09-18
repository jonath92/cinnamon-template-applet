import { Service, } from 'dbus-service'

interface Andyholmes extends imports.gi.Gio.DBusProxy {
  SimpleMethodSync: () => void
}



const { IconApplet } = imports.ui.applet
const GLib = imports.gi.GLib;
const Gio = imports.gi.Gio;

const { getDBusProperties, getDBus, getDBusProxyWithOwner } = imports.misc.interfaces

const ifaceXml = `
<node>
  <interface name="io.github.andyholmes.Test">
    <method name="SimpleMethod"/>
    <method name="ComplexMethod">
      <arg type="s" direction="in" name="input"/>
      <arg type="u" direction="out" name="length"/>
    </method>
    <signal name="TestSignal">
      <arg name="type" type="s"/>
      <arg name="value" type="b"/>
    </signal>
    <property name="ReadOnlyProperty" type="s" access="read"/>
    <property name="ReadWriteProperty" type="b" access="readwrite"/>
  </interface>
</node>`;

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




    const myApplet = new IconApplet(orientation, panelHeight, instanceId)

    myApplet.set_applet_icon_symbolic_name('computer')
    myApplet.on_applet_clicked = () => {

        global.log(getDBus().ListNamesSync())

        const proxy = Gio.DBusProxy.makeProxyWrapper(ifaceXml)

        
        
        const dummy2 = new proxy() as Andyholmes
        dummy2.SimpleMethodSync()
      


        //@ts-ignore
        const dummy = new proxy(Gio.DBus.session, 'io.github.andyholmes.Test', '/io/github/andyholmes/Test' )

        //@ts-ignore
        global.log(dummy.ReadOnlyProperty)

    }

    return myApplet
}