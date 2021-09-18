
const GLib = imports.gi.GLib;
const Gio = imports.gi.Gio;

// We'll use our XML definition from earlier as an example
const ifaceXml = `
<node>
  <interface name="org/gnome/gjs/Test">
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

export class Service {
  constructor() {
  }

  // Properties
  get ReadOnlyProperty() {
    return 'a string';
  }

  get ReadWriteProperty() {
    //@ts-ignore
    if (this._readWriteProperty === undefined)
      return false;
    //@ts-ignore

    return this._readWriteProperty;
  }

  set ReadWriteProperty(value) {
    //@ts-ignore

    this._readWriteProperty = value;
  }

  // Methods
  SimpleMethod() {
    global.log('SimpleMethod() invoked');
  }

  ComplexMethod(input: string[]) {
    global.log(`ComplexMethod() invoked with '${input}'`);

    return input.length;
  }
}