import EventHub from "./eventhub.js";

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
        this.enableTitleBar = true;
        if (this.platformName != "darwin") {
            this.enableTitleBarButtons = true;
        } else {
            this.enableTitleBarButtons = false;
        }
    }

    /**
     * Shows the application when it is ready.
     */
    AppReady() {
        // Subscrive to window focus events, emitting them as application events
        remote.getCurrentWindow().on("focus", () => {
            EventHub.$emit("window-foreground");
        });
        remote.getCurrentWindow().on("blur", () => {
            EventHub.$emit("window-background");
        });
        // Subscrive to window visual state events, emitting them as application events
        remote.getCurrentWindow().on("maximize", () => {
            EventHub.$emit("window-maximize");
        });
        remote.getCurrentWindow().on("unmaximize", () => {
            EventHub.$emit("window-restore");
        });
        // Show the application window
        ipcRenderer.send("ready");
    }

    /**
     * Minimizes the application.
     */
    Minimize() {
        remote.getCurrentWindow().minimize();
    }

    /**
     * Maximizes the application.
     */
    Maximize() {
        remote.getCurrentWindow().maximize();
    }

    /**
     * Restores the application.
     */
    Restore() {
        remote.getCurrentWindow().unmaximize();
    }

    /**
     * Closes the application.
     */
    Close() {
        remote.getCurrentWindow().close();
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