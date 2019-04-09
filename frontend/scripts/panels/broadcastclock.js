import ResizeObserver from "resize-observer-polyfill";

/**
 * A panel showing a broadcast style clock.
 */
export default {
    /**
     * Unsubscribes from resize event and clears throttle timeout when being destroyed.
     */
    beforeDestroy: function() {
        this.$options.resizeObserver.unobserve(this.$el);
        if (this.$options.throttleTimeout !== null) {
            clearTimeout(this.$options.throttleTimeout);
        }
    },
    template: `
        <div class="broadcast-clock">
            <canvas ref="canvas"></canvas>
        </div>
    `,
    props: {
        /**
         * The current time as a moment.js object.
         */
        time: {
            type: Object,
            required: true
        }
    },
    methods: {
        /**
         * Calculates the canvas size and positions of the clock elements.
         */
        CalculatePositions: function() {
            // Set canvas to match parent width and height
            this.$refs.canvas.height = this.$el.clientHeight * window.devicePixelRatio;
            this.$refs.canvas.width = this.$el.clientWidth * window.devicePixelRatio;
            // Calculate centre
            let centreX = this.$refs.canvas.width / 2;
            let centreY = this.$refs.canvas.height / 2;
            // Get radius from the smaller of the width and height
            let radius = this.$refs.canvas.width <= this.$refs.canvas.height ? this.$refs.canvas.width: this.$refs.canvas.height;
            // Set scale factor from 600px using radius
            this.$options.scaleFactor = radius / 600;
            // Offset the radius by the size of the second dots
            radius -= 20 * this.$options.scaleFactor;
            // Calculate positions for each dot
            for (let i = 0; i < 59; i++) {
                let deg = (360 / 59) * i;
                let positionX = ((radius / 2) * Math.sin(deg * (Math.PI / 180))) + centreX;
                let positionY = ((radius / 2) * -Math.cos(deg * (Math.PI / 180))) + centreY;
                this.$options.dotPositions[i] = [positionX, positionY];
            }
            // Calculate position for the text
            this.$options.textPosition[0] = centreX;
            this.$options.textPosition[1] = centreY;
        },
        /**
         * Draws the full clock on to the canvas.
         */
        DrawClock: function() {
            // Get canvas context
            let context = this.$refs.canvas.getContext("2d");
            // Clear the canvas
            context.clearRect(0, 0, this.$refs.canvas.width, this.$refs.canvas.height);
            // Draw the dots
            for (let i = 0; i < 59; i++) {
                let dotActive = i < this.time.seconds() ? true : false;
                this.DrawDot(context, i, dotActive);
            }
            // Draw text
            context.fillStyle = "#FF0000";
            context.font = `${100 * this.$options.scaleFactor}px sans-serif`;
            context.textAlign = "center";
            context.textBaseline = "middle";
            context.fillText(this.time.format("HH:mm:ss"), this.$options.textPosition[0], this.$options.textPosition[1]);
        },
        /**
         * Draws an individual second dot on to the canvas.
         * 
         * @param {RenderingContext} context The canvas context to draw on to.
         * @param {Number} number The dot number to be drawn.
         * @param {Boolean} active Specifies if the dot should be drawn as an active dot.
         */
        DrawDot: function(context, number, active) {
            // Start drawing a path
            context.beginPath();
            // Draw a full circle path
            context.arc(this.$options.dotPositions[number][0], this.$options.dotPositions[number][1], 10 * this.$options.scaleFactor, 0, 2 * Math.PI, false);
            // Set the fill colour
            if (active) {
                context.fillStyle = "#FF0000";
            } else {
                context.fillStyle = "#330000";
            }
            // Fill the path
            context.fill();
        }
    },
    /**
     * Sets up the clock and resize events on mount.
     */
    mounted: function() {
        // Set canvas size
        this.CalculatePositions();
        // Draw the clock
        this.DrawClock();
        // Handle resize event to redraw the clock
        this.$options.resizeObserver = new ResizeObserver(() => {
            if (!this.$options.drawThrottled) {
                this.$options.drawThrottled = true;
                this.CalculatePositions();
                this.DrawClock();
                this.$options.throttleTimeout = setTimeout(() => {
                    this.$options.drawThrottled = false;
                }, 250);
            }
        });
        this.$options.resizeObserver.observe(this.$el);
    },
    watch: {
        /**
         * Redraws the clock when the time is changed.
         */
        time: function() {
            this.DrawClock();
        }
    },
    /**
     * The scale the clock should be drawn at.
     * */
    scaleFactor: 1,
    /**
     * The positions of all the dots.
     * */
    dotPositions: new Array(59),
    /**
     * The positions of the text.
     */
    textPosition: new Array(2),
    /**
     * If redrawing is currently being throttled during resizing.
     */
    drawThrottled: false,
    /**
     * The resize observer.
     */
    resizeObserver: null,
    /**
     * The timeout for resetting the throttle.
     */
    throttleTimeout: null
}