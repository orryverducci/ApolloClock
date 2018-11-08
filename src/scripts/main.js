import Vue from "./vue.esm.browser.js";
import {platform} from "./platform.js";
import MainWindow from "./windows/main.js";
import OptionsMenu from "./windows/options.js";

new Vue({ 
    el: "#container",
    components: {
        MainWindow,
        OptionsMenu
    },
    data: {
        currentWindow: "MainWindow",
        menuOpen: false
    },
    methods: {
        OpenMenu: function() {
            this.menuOpen = true;
        },
        CloseMenu: function() {
            this.menuOpen = false;
        }
    },
    mounted: () => {
        platform.AppReady();
    }
});