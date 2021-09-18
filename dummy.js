'use strict';

const GLib = imports.gi.GLib;
const Gio = imports.gi.Gio;

// We'll use our XML definition from earlier as an example
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

class Service {
    constructor() {
    }

    // Properties
    get ReadOnlyProperty() {
        return 'a string';
    }

    get ReadWriteProperty() {
        if (this._readWriteProperty === undefined)
            return false;

        return this._readWriteProperty;
    }

    set ReadWriteProperty(value) {
        this._readWriteProperty = value;
    }

    // Methods
    SimpleMethod() {
        print('SimpleMethod() invoked');
    }

    ComplexMethod(input) {
        print(`ComplexMethod() invoked with '${input}'`);

        return input.length;
    }
}

// Note that when using the DBus conveniences in GJS, our JS Object instance is
// separate from the interface GObject instance.
let serviceObject = new Service();
let serviceIface = null;

function onBusAcquired(connection, name) {
    serviceIface = Gio.DBusExportedObject.wrapJSObject(ifaceXml, this);
    serviceIface.export(connection, '/io/github/andyholmes/Test');
}

function onNameAcquired(connection, name) {
    // Clients will typically start connecting and using your interface now.
}

function onNameLost(connection, name) {
    // Well behaved clients will know not to be calling methods on your
    // interface now.
}

let ownerId = Gio.bus_own_name(
    Gio.BusType.SESSION,
    'io.github.andyholmes.Test',
    Gio.BusNameOwnerFlags.NONE,
    onBusAcquired.bind(serviceObject),
    onNameAcquired,
    onNameLost
);

// Start an event loop
let loop = GLib.MainLoop.new(null, false);
loop.run();