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
}

// Export class as a singleton
/** Provides platform specific functionality. */
export let platform = new Platform();