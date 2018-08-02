import Vue from "./vue.esm.browser.js";
import {platform} from "./platform.js";

new Vue({ 
    el: "#container",
    mounted: () => {
        platform.AppReady();
    }
});