import Vue from "./vue.esm.browser.js";
import {platform} from "./platform.js";
import MainPage from "./pages/main.js";
import AboutPage from "./pages/about.js";
import EventHub from "./eventhub.js";

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
    data: {
        currentPage: "MainPage"
    },
    methods: {
        OpenPage: function(page) {
            this.currentPage = `${page.charAt(0).toUpperCase()}${page.slice(1)}Page`;
        },
        GoBack: function(event) {
            event.preventDefault();
            this.currentPage = "MainPage";
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