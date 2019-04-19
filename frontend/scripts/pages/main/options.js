import { library } from "@fortawesome/fontawesome-svg-core";
import { faInfoCircle, faObjectGroup } from "@fortawesome/free-solid-svg-icons";
import EventHub from "../../eventhub.js";

/**
 * The main page options menu.
 */
export default {
    /**
     * Adds the requried Font Awesome icons to the library when created.
     */
    created: function() {
        library.add(faInfoCircle);
        library.add(faObjectGroup);
    },
    template: `
        <aside id="options-menu">
            <ul>
                <li><a href="#" v-on:click.prevent="OpenPanels">
                    <span class="icon"><font-awesome-icon icon="object-group" /></span>Change Panels
                </a></li>
                <li><a href="#" v-on:click.prevent="OpenAbout">
                    <span class="icon"><font-awesome-icon icon="info-circle" /></span>About
                </a></li>
            </ul>
        </aside>
    `,
    methods: {
        /**
         * Emits an event signalling the panels page should be opened.
         */
        OpenPanels: function() {
            alert("Not Yet Implemented");
        },
        /**
         * Emits an event signalling the about page should be opened.
         */
        OpenAbout: function() {
            EventHub.$emit("open-page", "about");
        }
    }
}