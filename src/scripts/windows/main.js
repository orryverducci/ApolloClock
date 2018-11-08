import moment from "../moment.js";
import BroadcastClock from "../panels/broadcastclock.js";

export default {
    template: '<main id="main-window" v-on:contextmenu="OpenMenu" v-on:click="CloseMenu" v-on:touchstart="TouchStart" v-on:touchend="TouchEnd"><broadcast-clock v-bind:time="time"></broadcast-clock></main>',
    components: {
        BroadcastClock
    },
    data: function() {
        return {
            /**
             * The current time as a moment.js object.
             */
            time: moment()
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
            this.$emit("open-menu");
        },
        /**
         * Emits an event signalling the options menu should be closed.
         */
        CloseMenu: function() {
            this.$emit("close-menu");
        },
        TouchStart: function(event) {
            this.$options.swipeStartX = event.changedTouches[0].clientX;
        },
        TouchEnd: function(event) {
            let swipeDistance = this.$options.swipeStartX - event.changedTouches[0].clientX;
            if (swipeDistance > 100) {
                this.OpenMenu();
            }
        }
    },
    mounted: function() {
        // Update the clock
        this.UpdateClock();
    },
    swipeStartX: 0
}