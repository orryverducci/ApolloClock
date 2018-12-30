import moment from "moment";
import BroadcastClock from "../../panels/broadcastclock.js";
import OptionsMenu from "./options.js";

/**
 * The main page.
 */
export default {
    template: '<main id="main-page"><div id="panels" v-on:contextmenu="OpenMenu" v-on:click="CloseMenu" v-on:touchstart="TouchStart" v-on:touchend="TouchEnd"><broadcast-clock v-bind:time="time"></broadcast-clock></div><transition><options-menu v-if="menuOpen"></options-menu></transition></main>',
    components: {
        BroadcastClock,
        OptionsMenu
    },
    data: function() {
        return {
            /**
             * The current time as a moment.js object.
             */
            time: moment(),
            /**
             * Specifies if the options menu should be open.
             */
            menuOpen: false
        }
    },
    methods: {
        /**
         * Updates the clock if the time has changed.
         */
        UpdateClock: function() {
            // Get current time
            let time = moment();
            // Check if the second has changed, if it has send time update
            if (this.time.second() !== time.second()) {
                this.time = time;
            }
            // Run this function again on the next frame
            window.requestAnimationFrame(this.UpdateClock);
        },
        /**
         * Emits an event signalling the options menu should be opened.
         */
        OpenMenu: function() {
            this.menuOpen = true;
        },
        /**
         * Emits an event signalling the options menu should be closed.
         */
        CloseMenu: function() {
            this.menuOpen = false;
        },
        /**
         * Records the touch position when the user starts touching the screen.
         * @param {Event} event The event which fired this method.
         */
        TouchStart: function(event) {
            this.$options.swipeStartX = event.changedTouches[0].clientX;
        },
        /**
         * Calculates if the user has swiped when the user stops touching the screen, opening the options menu if they have.
         * @param {*} event 
         */
        TouchEnd: function(event) {
            let swipeDistance = this.$options.swipeStartX - event.changedTouches[0].clientX;
            if (swipeDistance > 100) {
                this.OpenMenu();
            }
        }
    },
    /**
     * Triggers the initial update of the clock on mount.
     */
    mounted: function() {
        // Update the clock
        this.UpdateClock();
    },
    /**
     * The initial touch position.
     */
    swipeStartX: 0
}