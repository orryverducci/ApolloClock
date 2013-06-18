using System;

namespace ShockClock
{
    public class StudioEventArgs : EventArgs
    {
        private int studioNumber;

        public StudioEventArgs(int studio)
        {
            studioNumber = studio;
        }

        /// <summary>
        /// The IP of the command source
        /// </summary>
        public int StudioNumber
        {
            get
            {
                return studioNumber;
            }
        }
    }

    public delegate void StudioEventHandler(object sender, StudioEventArgs studio);
}
