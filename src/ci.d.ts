import "@ci-types/cjs";

declare global {
    // added during build (see webpack.config.js)
    interface Meta {
        instanceId: number
        orientation: imports.gi.St.Side
        panel: imports.ui.panel.Panel
        locationLabel: imports.ui.appletManager.LocationLabel
    }
}