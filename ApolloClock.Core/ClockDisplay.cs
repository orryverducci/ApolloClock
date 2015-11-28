using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;

namespace ApolloClock.Core
{
    public sealed class ClockDisplay : IDisposable
    {
        #region Private Fields
        /// <summary>
        /// The timer which updates the clock
        /// </summary>
        private Timer timer;
        #endregion

        #region Properties
        /// <summary>
        /// The current hour on the clock, in 24 hour clock format
        /// </summary>
        public int ClockHour { get; private set; } = 0;

        /// <summary>
        /// The current minutes on the clock
        /// </summary>
        public int ClockMinutes { get; private set; } = 0;

        /// <summary>
        /// The current seconds on the clock
        /// </summary>
        public int ClockSeconds { get; private set; } = 0;
        #endregion

        #region Event
        public event EventHandler ClockChange;
        #endregion

        #region Constructor and dispose
        /// <summary>
        /// Initialises a new instance of the ClockDisplay class
        /// </summary>
        public ClockDisplay()
        {
            // Update the clock, setting the time
            UpdateClock(null);
            // Create the timer to update the clock, and set it to an interval of 10 milliseconds
            timer = new Timer(UpdateClock, null, 0, 10);
        }

        /// <summary>
        /// Releases all resources used by the current instance of ClockDisplay
        /// </summary>
        public void Dispose()
        {
            timer.Dispose();
        }
        #endregion

        #region Clock Functions
        /// <summary>
        /// Callback for the timer, retrieves the current time from the system clock
        /// </summary>
        /// <param name="state">Timer state object</param>
        private void UpdateClock(Object state)
        {
            // Get the current time from the system clock
            DateTime time = DateTime.Now;
            // If the time has changed since last update, change the clock
            if (time.Second != ClockSeconds)
            {
                ClockHour = time.Hour;
                ClockMinutes = time.Minute;
                ClockSeconds = time.Second;
                // Fire clock change event, if any classes are subscribed to it
                if (ClockChange != null)
                {
                    ClockChange(this, null);
                }
            }
        }
        #endregion
    }
}
