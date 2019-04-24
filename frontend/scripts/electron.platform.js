import EventHub from "./eventhub.js";

const {ipcRenderer, remote} = require("electron"),
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
        this.enableTitleBar = true;
        if (os.platform() != "darwin") {
            this.enableTitleBarButtons = true;
        } else {
            this.enableTitleBarButtons = false;
        }
    }

    /**
     * Gets the platform name.
     */
    GetPlatform() {
        return os.platform();
    }

    /**
     * Shows the application when it is ready.
     */
    AppReady() {
        // Subscrive to full screen events, emitting them as application events
        remote.getCurrentWindow().on("enter-full-screen", () => {
            EventHub.$emit("enter-full-screen");
        });
        remote.getCurrentWindow().on("leave-full-screen", () => {
            EventHub.$emit("leave-full-screen");
        });
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
        // Set to exit full screen when the escape key is pressed
        document.addEventListener("keydown", (event) => {
            if (remote.getCurrentWindow().isFullScreen() && event.key == "Escape") {
                remote.getCurrentWindow().setFullScreen(false);
                event.preventDefault();
            }
        });
        // Show the application window
        ipcRenderer.send("ready");
    }

    /**
     * Enters full screen mode.
     */
    Expand() {
        remote.getCurrentWindow().setFullScreen(true);
    }

    /**
     * Exits full screen mode.
     */
    Compress() {
        remote.getCurrentWindow().setFullScreen(false);
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
     * @param {string} defaultValue The default value to be returned if the key has not yet been set.
     * @returns {string} The configuration data.
     */
    GetConfig(key, defaultValue) {
        return this.store.get(key, defaultValue);
    }
}

// Export class as a singleton
/** Provides platform specific functionality. */
export let platform = new Platform();