export default {
    template: '<div class="broadcast-clock"><canvas ref="canvas"></canvas></div>',
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
    mounted: function() {
        // Set canvas size
        this.CalculatePositions();
        // Draw the clock
        this.DrawClock();
        // Handle resize event to redraw the clock
        window.addEventListener("resize", () => {
            this.CalculatePositions();
            this.DrawClock();
        });
    },
    watch: {
        time: function() {
            this.DrawClock();
        }
    },
    scaleFactor: 1,
    dotPositions: new Array(59),
    textPosition: new Array(2)
}