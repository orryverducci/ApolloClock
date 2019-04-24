import { Plugins } from "@capacitor/core";
const { App, Device, SplashScreen } = Plugins;

/**
 * Provides platform specific functionality.
 */
class Platform {
    /**
     * Initialises the platform class.
     */
    constructor() {
        this.enableTitleBar = false;
        this.enableTitleBarButtons = false;
    }

    /**
     * Gets the platform name.
     */
    async GetPlatform() {
        let deviceInfo = await Device.getInfo();
        return deviceInfo.platform;
    }

    /**
     * Shows the application when it is ready.
     */
    AppReady() {
        // Hide the splash screen
        SplashScreen.hide();
        // Enable platform back button, exiting the app when pressed
        App.addListener("backButton", () => {
            App.exitApp();
        });
    }

    /**
     * Enters full screen mode.
     */
    Expand() {
        console.info("Entering full screen is not available on this platform");
    }

    /**
     * Exits full screen mode.
     */
    Compress() {
        console.info("Exiting full screen is not available on this platform");
    }

    /**
     * Minimizes the application.
     */
    Minimize() {
        console.info("Minimizing the application is not available on this platform");
    }

    /**
     * Maximizes the application.
     */
    Maximize() {
        console.info("Maximizing the application is not available on this platform");
    }

    /**
     * Restores the application.
     */
    Restore() {
        console.info("Restoring the application is not available on this platform");
    }
    
    /**
     * Closes the application.
     */
    Close() {
        console.info("Closing the application is not available on this platform");
    }

    /**
     * Sets a configuration setting.
     * @param {string} key The key the data should be stored as.
     * @param {string} data The data to be stored.
     */
    async SetConfig(key, data) {
        await Storage.set({
            key: key,
            value: data
        });
    }

    /**
     * Gets a configuration setting.
     * @param {string} key The key for the data to be retrieved.
     * @param {string} defaultValue The default value to be returned if the key has not yet been set.
     * @returns {string} The configuration data.
     */
    async GetConfig(key, defaultValue) {
        configKeys = await Storage.keys();
        if (configKeys.includes(key)) {
            return await Storage.get({ key: key });
        }
        return defaultValue;
    }
}

// Export class as a singleton
/** Provides platform specific functionality. */
export let platform = new Platform();