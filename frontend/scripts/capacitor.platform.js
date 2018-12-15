import { Plugins } from "@capacitor/core";
const { App, SplashScreen } = Plugins;

/**
 * Provides platform specific functionality.
 */
class Platform {
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
     * @returns {string} The configuration data.
     */
    async GetConfig(key) {
        return await Storage.get({ key: key });
    }
}

// Export class as a singleton
/** Provides platform specific functionality. */
export let platform = new Platform();