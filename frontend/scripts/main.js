import Vue from "Vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faCaretSquareLeft } from "@fortawesome/free-solid-svg-icons";
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
        library.add(faCaretSquareLeft);
    },
    data: {
        /**
         * The page currently being displayed.
         */
        currentPage: "MainPage",
        /**
         * The platform the application is running on.
         */
        platform: ""
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
         * @param {Event} event The event which fired this method.
         */
        GoBack: function(event) {
            event.preventDefault();
            this.currentPage = "MainPage";
        }
    },
    /**
     * Fires the platform specific AppReady method and subscribes to the global events on mount.
     */
    mounted: function() {
        this.platform = platform.platformName;
        platform.AppReady();
        EventHub.$on("open-page", this.OpenPage);
        
    },
    /**
     * Unsubscribes from the global events when being destroyed.
     */
    beforeDestroy: function() {
        EventHub.$off("open-page", this.OpenPage);
    },
});