import Vue from "Vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faCaretSquareLeft } from "@fortawesome/free-solid-svg-icons";
import {platform} from "platform";
import MainPage from "./pages/main/page.js";
import AboutPage from "./pages/about/page.js";
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
    created: function() {
        // Setup global component for Font Awesome
        Vue.component("font-awesome-icon", FontAwesomeIcon);
        library.add(faCaretSquareLeft);
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