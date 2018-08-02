import { Plugins } from "@capacitor/core";
const { SplashScreen } = Plugins;

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
    }
}

// Export class as a singleton
/** Provides platform specific functionality. */
export let platform = new Platform();