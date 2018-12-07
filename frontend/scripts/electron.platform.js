const {ipcRenderer} = require("electron");

/**
 * Provides platform specific functionality.
 */
class Platform {
    /**
     * Shows the application when it is ready.
     */
    AppReady() {
        // Show the application window
        ipcRenderer.send("ready");
    }
}

// Export class as a singleton
/** Provides platform specific functionality. */
export let platform = new Platform();