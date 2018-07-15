import {app, BrowserWindow, protocol} from "electron";
import installExtension, {VUEJS_DEVTOOLS} from "electron-devtools-installer";
import {readFileSync as read} from "fs";
import jsonfile from "jsonfile";
import path from "path";
import {URL} from "url";

// Global reference for the main window, preventing it from being garbage collected
let mainWindow = null;

// Set app path to the application's root folder
app.setAppPath(__dirname);

// Register the app protocol as a standard stream
protocol.registerStandardSchemes(["app"], { secure: true });

/**
 * Creates a standard scheme for use by the application
 */
function createAppProtocol() {
    // Create the app protocol
    protocol.registerBufferProtocol("app", (request, callback) => {
        // Get path name from url
        let pathName = new URL(request.url).pathname;
        // Create path to the file to return
        let filePath = path.join(__dirname, "app", pathName);
        // Get the file extension
        let fileExtension = path.extname(filePath).substr(1);
        // Determine the appropriate MIME type for the file
        let fileMimeType = "application/octet-stream";
        let mimeTypes = jsonfile.readFileSync(path.join(__dirname, "mimetypes.json"));
        if (typeof mimeTypes[fileExtension] !== "undefined") {
            fileMimeType = mimeTypes[fileExtension];
        }
        // Get a buffer containing the file contents
        let fileData = read(filePath);
        // Return the file contents with the appropriate mime type
        callback({
            mimeType: fileMimeType,
            data: fileData
        });
    }, (error) => {
        if (error) {
            console.error("Failed to register app protocol");
        }
    });
}

/**
 * Setup Chrome developer tools
 */
function setupDevTools() {
    // Add Vue Devtools
    installExtension(VUEJS_DEVTOOLS).catch((error) => {
        console.log(`Unable to add Vue Devtools: ${error}`);
    });
}

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
    mainWindow.loadURL("app://apolloclock/index.html");
    // Destroy reference to the main window when it is closed
    mainWindow.on("closed", () => {
        mainWindow = null;
    });
}

// Create the main window when Electron has finished initialization
app.on("ready", () => {
    createAppProtocol();
    setupDevTools();
    createMainWindow();
});

// Quit the application when all windows are closed
app.on("window-all-closed", () => {
    app.quit();
});