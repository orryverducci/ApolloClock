import Vue from "Vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faArrowLeft, faWindowMinimize, faWindowMaximize, faWindowRestore, faTimes } from "@fortawesome/free-solid-svg-icons";
import {platform} from "platform";
import MainPage from "./pages/main/page.js";
import AboutPage from "./pages/about/page.js";
import EventHub from "./eventhub.js";

/**
 * The main vue instance for the application.
 */
new Vue({ 
    el: "#container",
    components: {
        MainPage,
        AboutPage
    },
    computed: {
        showBack: function () {
          return this.currentPage !== "MainPage";
        }
    },
    /**
     * Sets up the Font Awesome component and adds the left caret icon to its library on creation.
     */
    created: function() {
        // Setup global component for Font Awesome
        Vue.component("font-awesome-icon", FontAwesomeIcon);
        library.add(faArrowLeft);
        library.add(faWindowMinimize);
        library.add(faWindowMaximize);
        library.add(faWindowRestore);
        library.add(faTimes);
    },
    data: {
        /**
         * The page currently being displayed.
         */
        currentPage: "MainPage",
        /**
         * The platform the application is running on.
         */
        platform: "",
        /**
         * If the title bar is visible.
         */
        titleBarVisible: false,
        /**
         * If the title bar buttons are visible (does not affect the back button).
         */
        titleButtonsVisible: false,
        /**
         * If the window is currently in the foreground.
         */
        foreground: true,
        /**
         * If the window is currently maximized.
         */
        maximized: false
    },
    methods: {
        /**
         * Opens the specified page.
         * @param {String} page The page to be opened.
         */
        OpenPage: function(page) {
            this.currentPage = `${page.charAt(0).toUpperCase()}${page.slice(1)}Page`;
        },
        /**
         * Changes the page back to the main page.
         */
        GoBack: function() {
            this.currentPage = "MainPage";
        },
        /**
         * Minimizes the application.
         */
        Minimize: function() {
            platform.Minimize();
        },
        /**
         * Maximizes the application.
         */
        Maximize: function() {
            platform.Maximize();
        },
        /**
         * Restores the application.
         */
        Restore: function() {
            platform.Restore();
        },
        /**
         * Closes the application.
         */
        Close: function() {
            platform.Close();
        },
        /**
         * Sets that the window is currently in the foreground.
         */
        SetForeground: function() {
            this.foreground = true;
        },
        /**
         * Sets that the window is currently in the background.
         */
        SetBackground: function() {
            this.foreground = false;
        },
        /**
         * Sets that the window is currently maximized.
         */
        SetMaximized: function() {
            this.maximized = true;
        },
        /**
         * Sets that the window is no longer maximized.
         */
        SetRestored: function() {
            this.maximized = false;
        }
        }
    },
    /**
     * Fires the platform specific AppReady method and subscribes to the global events on mount.
     */
    mounted: function() {
        this.platform = platform.platformName;
        this.titleBarVisible = platform.enableTitleBar;
        this.titleButtonsVisible = platform.enableTitleBarButtons;
        platform.AppReady();
        EventHub.$on("open-page", this.OpenPage);
        EventHub.$on("window-foreground", this.SetForeground);
        EventHub.$on("window-background", this.SetBackground);
        EventHub.$on("window-maximize", this.SetMaximized);
        EventHub.$on("window-restore", this.SetRestored);
    },
    /**
     * Unsubscribes from the global events when being destroyed.
     */
    beforeDestroy: function() {
        EventHub.$off("open-page", this.OpenPage);
        EventHub.$off("window-foreground", this.SetForeground);
        EventHub.$off("window-background", this.SetBackground);
        EventHub.$off("window-maximize", this.SetMaximized);
        EventHub.$off("window-restore", this.SetRestored);
    },
});