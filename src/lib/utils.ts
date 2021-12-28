const { layoutManager, panelManager } = imports.ui.main
const { PanelLoc } = imports.ui.panel

interface FreeSpaceBox {
    left: number,
    top: number,
    bottom: number,
    right: number
}

function calculateFreeSpace(): FreeSpaceBox {
    const monitor = layoutManager.findMonitorForActor(__meta.panel.actor)
    const visiblePanels = panelManager.getPanelsInMonitor(monitor.index)

    const panelSizes = new Map(visiblePanels.map(panel => {
        let width = 0, height = 0;

        if (panel.getIsVisible()) {
            width = panel.actor.width;
            height = panel.actor.height;
        }

        return [panel.panelPosition, { width, height }]
    }))

    return {
        left: monitor.x + (panelSizes.get(PanelLoc.left)?.width || 0),
        bottom: monitor.y + monitor.height - (panelSizes.get(PanelLoc.bottom)?.height || 0),
        top: monitor.y + (panelSizes.get(PanelLoc.top)?.height || 0),
        right: monitor.x + monitor.width - (panelSizes.get(PanelLoc.right)?.width || 0)
    }
}