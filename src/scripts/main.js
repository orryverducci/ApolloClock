import Vue from "./vue.esm.browser.js";
import {platform} from "./platform.js";
import MainWindow from "./windows/main.js";
import EventHub from "./eventhub.js";

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
        OpenPage: function(page) {
            this.currentWindow = `${page.charAt(0).toUpperCase()}${page.slice(1)}Window`;
        },
        GoBack: function(event) {
            event.preventDefault();
            this.currentWindow = "MainWindow";
        }
    },
    mounted: function() {
        platform.AppReady();
        EventHub.$on("open-page", this.OpenPage);
        
    },
    beforeDestroy: function() {
        EventHub.$off("open-page", this.OpenPage);
    },
});