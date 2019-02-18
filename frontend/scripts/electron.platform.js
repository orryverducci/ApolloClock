const {ipcRenderer} = require("electron"),
    os = require("os"),
    Store = require("electron-store");

/**
 * Provides platform specific functionality.
 */
class Platform {
    /**
     * Initialises the platform class.
     */
    constructor() {
        this.store = new Store();
        this.platformName = os.platform;
    }

    /**
     * Shows the application when it is ready.
     */
    AppReady() {
        // Show the application window
        ipcRenderer.send("ready");
    }

    /**
     * Sets a configuration setting.
     * @param {string} key The key the data should be stored as.
     * @param {string} data The data to be stored.
     */
    SetConfig(key, data) {
        this.store.set(key, data);
    }

    /**
     * Gets a configuration setting.
     * @param {string} key The key for the data to be retrieved.
     * @returns {string} The configuration data.
     */
    GetConfig(key) {
        return this.store.get(key);
    }
}

// Export class as a singleton
/** Provides platform specific functionality. */
export let platform = new Platform();