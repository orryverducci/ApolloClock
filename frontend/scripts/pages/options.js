import EventHub from "../eventhub.js";

export default {
    template:
        `<aside id="options-menu">
            <ul>
                <li><a href="#" v-on:click="OpenPanels($event)">
                    <img src="images/object-group.svg">Change Panels
                </a></li>
                <li><a href="#" v-on:click="OpenAbout($event)">
                    <img src="images/info-circle.svg">About
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