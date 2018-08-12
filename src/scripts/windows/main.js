import moment from "../moment.js";

export default {
    template: '<main id="main-window"></main>',
    data: function() {
        return {
            time: moment()
        }
    },
    methods: {
        UpdateClock: function() {
            // Get current time
            let time = moment();
            // Check if the second has changed, if it has send time update
            if (this.time.second() !== time.second()) {
                this.time = time;
            }
            // Run this function again on the next frame
            window.requestAnimationFrame(this.UpdateClock);
        }
    },
    mounted: function() {
        this.UpdateClock();
    }
}