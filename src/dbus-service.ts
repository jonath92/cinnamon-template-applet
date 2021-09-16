const GLib = imports.gi.GLib;
const Gio = imports.gi.Gio;

/*
 * An XML DBus Interface
 */
const ifaceXml = `
<node>
  <interface name="org.gnome.gjs.Test">
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

// An example of the service-side implementation of the above interface.
export class Service {

    // @ts-ignore
    public dbus = Gio.DBusExportedObject

    constructor(){
        // @ts-ignore
        this.dbus = Gio.DBusExportedObject.wrapJSObject(ifaceXml, this);
        global.log('this.dbus', this.dbus)
    }

}