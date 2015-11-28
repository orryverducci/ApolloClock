using System;
using System.Collections.Generic;
using System.Text;

namespace ApolloClock.Core
{
    public interface IClock
    {
        /// <summary>
        /// The hour shown on the clock
        /// </summary>
        int Hour { get; set; }

        /// <summary>
        /// The minutes shown on the clock
        /// </summary>
        int Minutes { get; set; }

        /// <summary>
        /// The seconds shown on the clock
        /// </summary>
        int Seconds { get; set; }
    }
}
