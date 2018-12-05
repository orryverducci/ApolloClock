import Vue from "./vue.esm.browser.js";
import {platform} from "./platform.js";
import MainWindow from "./windows/main.js";

new Vue({ 
    el: "#container",
    components: {
        MainWindow
    computed: {
        showBack: function () {
          return this.currentWindow !== "MainWindow";
        }
    },
    data: {
        currentWindow: "MainWindow"
    },
    methods: {
        GoBack: function(event) {
            event.preventDefault();
            this.currentWindow = "MainWindow";
        }
    },
    mounted: () => {
        platform.AppReady();
    }
});