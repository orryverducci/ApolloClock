import Vue from "./vue.esm.browser.js";
import {platform} from "./platform.js";
import MainWindow from "./windows/main.js";

new Vue({ 
    el: "#container",
    components: {
        MainWindow
    },
    data: {
        currentWindow: "MainWindow"
    },
    methods: {
        }
    },
    mounted: () => {
        platform.AppReady();
    }
});