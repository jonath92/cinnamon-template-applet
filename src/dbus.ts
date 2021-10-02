const { spawnCommandLine } = imports.misc.util;
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
    <method name='OpenUri'> 
      <arg direction='in' name='Uri' type='s'/>
    </method>

    <signal name="TestSignal">
      <arg name="type" type="s"/>
      <arg name="value" type="b"/>
    </signal>
    <property name="ReadOnlyProperty" type="s" access="read"/>
    <property name="ReadWriteProperty" type="b" access="readwrite"/>
  </interface>
</node>`;

interface Andyholmes extends imports.gi.Gio.DBusProxy {
  SimpleMethodSync: () => void
  ComplexMethodSync: (input: string) => [number],
  OpenUriRemote: (uri: string) => void,
  readonly ReadOnlyProperty: string,
  ReadWriteProperty: boolean
}

let dbusConnection: imports.gi.Gio.DBusConnection | null = null
let dbusClient: Andyholmes | null = null

class Service {

  private _readWriteProperty: boolean = false

  constructor() {

  }

  get ReadOnlyProperty() {
    return 'a string';
  }

  // TODO: getter and setter necessary?
  get ReadWriteProperty() {
    return this._readWriteProperty
  }

  set ReadWritePoperty(newValue: boolean) {
    this._readWriteProperty = newValue
  }

  OpenUri(uri: string) {
    global.log('OpenUri called')
    spawnCommandLine(`mpv ${uri} --input-ipc-server=/tmp/mpvsocket`)
  }

  SimpleMethod() {
    global.log('SimpleMethod invoked')
    return
  }

  ComplexMethod(input: string) {
    global.log(`ComplexMethod invoked with ${input}`)
    return input.length
  }

}

// TODO: remove export once it is working
async function serveDbus(): Promise<imports.gi.Gio.DBusConnection> {

  // TODO reject when not resolved after 10 secs
  return new Promise<imports.gi.Gio.DBusConnection>((resolve, reject) => {

    let serviceObject = new Service()

    let serviceIface: imports.gi.Gio.DBusInterfaceSkeleton | null = null


    function onBusAcquired(connection: imports.gi.Gio.DBusConnection, name: string) {
      serviceIface = Gio.DBusExportedObject.wrapJSObject(ifaceXml, serviceObject)
      serviceIface.export(connection, '/io/github/andyholmes/Test')
      global.log('OnBusAcquired')
      resolve(connection)
    }

    function onNameAcquired(connection: imports.gi.Gio.DBusConnection, name: string) {
      global.log('name acquired')
      // Clients will typically start connecting and using your interface now.
    }

    function onNameLost(connection: imports.gi.Gio.DBusConnection, name: string) {
      global.log('name lost')
      // Well behaved clients will know not to be calling methods on your
      // interface now.
    }

    Gio.bus_own_name(
      Gio.BusType.SESSION,
      'io.github.andyholmes.Test',
      Gio.BusNameOwnerFlags.NONE,
      onBusAcquired,
      onNameAcquired,
      onNameLost
    );

  })

}


export async function getClient(): Promise<Andyholmes> {

  if (!dbusConnection) {
    dbusConnection = await serveDbus()
  }

  return new Promise((resolve, reject) => {
    if (dbusClient) {
      resolve(dbusClient)
      return
    }

    const ProxyWrapper = Gio.DBusProxy.makeProxyWrapper(ifaceXml)

    new ProxyWrapper(Gio.DBus.session, 'io.github.andyholmes.Test', '/io/github/andyholmes/Test', (newClient: Andyholmes) => {
      dbusClient = newClient
      resolve(newClient)
    })

  })
}


