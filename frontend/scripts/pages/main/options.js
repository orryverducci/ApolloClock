import { library } from "@fortawesome/fontawesome-svg-core";
import { faInfoCircle, faObjectGroup } from "@fortawesome/free-solid-svg-icons";
import EventHub from "../../eventhub.js";

export default {
    created: function() {
        library.add(faInfoCircle);
        library.add(faObjectGroup);
    },
    template:
        `<aside id="options-menu">
            <ul>
                <li><a href="#" v-on:click="OpenPanels($event)">
                    <span class="icon"><font-awesome-icon icon="object-group" /></span>Change Panels
                </a></li>
                <li><a href="#" v-on:click="OpenAbout($event)">
                    <span class="icon"><font-awesome-icon icon="info-circle" /></span>About
                </a></li>
            </ul>
        </aside>`,
        methods: {
            OpenPanels: function(event) {
                event.preventDefault();
                alert("Not Yet Implemented");
            },
            OpenAbout: function(event) {
                event.preventDefault();
                EventHub.$emit("open-page", "about");
            }
        }
}