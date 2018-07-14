import {app, BrowserWindow} from "electron";
import path from "path";
import url from "url";

// Global reference for the main window, preventing it from being garbage collected
let mainWindow = null;

// Set app path to the application's root folder
app.setAppPath(__dirname);

/**
 * Creates the main application window
 */
function createMainWindow() {
    // Create the main window
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600
    });
    // Load the main window
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, "app", "index.html"),
        protocol: "file:",
        slashes: true
    }));
    // Destroy reference to the main window when it is closed
    mainWindow.on("closed", () => {
        mainWindow = null;
    });
}

// Create the main window when Electron has finished initialization
app.on("ready", () => {
    createMainWindow();
});

// Quit the application when all windows are closed
app.on("window-all-closed", () => {
    app.quit();
});