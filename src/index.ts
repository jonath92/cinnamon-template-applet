
interface Andyholmes extends imports.gi.Gio.DBusProxy {
  SimpleMethodSync: () => void
  ComplexMethodSync: (input: string) => [number]
  readonly ReadOnlyProperty: string,
  ReadWriteProperty: boolean
}



const { IconApplet } = imports.ui.applet
const GLib = imports.gi.GLib;
const Gio = imports.gi.Gio;
const Mainloop = imports.mainloop

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

  SimpleMethod() {
    global.log('SimpleMethod invoked')
    return
  }

  ComplexMethod(input: string) {
    global.log(`ComplexMethod invoked with ${input}`)
    return input.length
  }

}


async function serveDbus(): Promise<imports.gi.Gio.DBusConnection> {


  return new Promise<imports.gi.Gio.DBusConnection>((resolve, reject) => {
    global.log('serveDBu called')

    let serviceObject = new Service()

    let serviceIface: imports.gi.Gio.DBusInterfaceSkeleton | null = null


    function onBusAcquired(connection: imports.gi.Gio.DBusConnection, name: string) {
      serviceIface = Gio.DBusExportedObject.wrapJSObject(ifaceXml, serviceObject)
      serviceIface.export(connection, '/io/github/andyholmes/Test')
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


  // Start an event loop

  // return dbusConnection
}

export function main(args: Arguments): imports.ui.applet.Applet {

  const {
    orientation,
    panelHeight,
    instanceId
  } = args


  let dbusConnection: imports.gi.Gio.DBusConnection | null = null


  const myApplet = new IconApplet(orientation, panelHeight, instanceId)


  let proxy: Andyholmes | null = null


  myApplet.set_applet_icon_symbolic_name('computer')
  myApplet.on_applet_clicked = async () => {

    if (!dbusConnection) {
      dbusConnection = await serveDbus()
    }

    const dbusRegistered = getDBus().ListNamesSync()[0].find(name => name === 'io.github.andyholmes.Test')

    global.log('dbusRegistered', dbusRegistered)

    if (!proxy) {
      const Proxy = Gio.DBusProxy.makeProxyWrapper(ifaceXml)

      new Proxy(Gio.DBus.session, 'io.github.andyholmes.Test', '/io/github/andyholmes/Test', (newProxy: Andyholmes) => {
        proxy = newProxy
        global.log('proxy callback called')
        global.log(proxy.ReadWriteProperty)
      })
    }

    else {
      // TODO: only working with Remote!
      // @ts-ignore
      proxy.ComplexMethodRemote('test')
    }



    // try {
    //   const dummy = new proxy(Gio.DBus.session, 'io.github.andyholmes.Test', '/io/github/andyholmes/Test') as Andyholmes
    //   dummy.SimpleMethodSync()
    // } catch (error) {
    //   global.log(error)
    // }
  }


  // @ts-ignore
  //myApplet.dbusConnection = dbusConnection

  return myApplet
}