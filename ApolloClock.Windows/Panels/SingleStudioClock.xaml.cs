using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Runtime.InteropServices.WindowsRuntime;
using Windows.Foundation;
using Windows.Foundation.Collections;
using Windows.UI.Core;
using Windows.UI.Xaml;
using Windows.UI.Xaml.Controls;
using Windows.UI.Xaml.Controls.Primitives;
using Windows.UI.Xaml.Data;
using Windows.UI.Xaml.Input;
using Windows.UI.Xaml.Media;
using Windows.UI.Xaml.Navigation;
using Windows.UI.Xaml.Shapes;
using ApolloClock.Core;
using System.Diagnostics;

namespace ApolloClock.Windows
{
    public sealed partial class SingleStudioClock : UserControl, IClock
    {
        #region Private Fields
        /// <summary>
        /// The hour shown on the clock
        /// </summary>
        private int hour;

        /// <summary>
        /// The minutes shown on the clock
        /// </summary>
        private int minutes;

        /// <summary>
        /// The seconds shown on the clock
        /// </summary>
        private int seconds;

        /// <summary>
        /// Directory of all the ellipses on the UI that make up the dots representing seconds passed
        /// </summary>
        private Dictionary<int, Ellipse> secondDots;
        #endregion

        #region Properties
        /// <summary>
        /// The hour shown on the clock
        /// </summary>
        public int Hour
        {
            get
            {
                return hour;
            }
            set
            {
                if (value != hour)
                {
                    hour = value;
                    #pragma warning disable CS4014 // Because this call is not awaited, execution of the current method continues before the call is completed
                    Dispatcher.RunAsync(CoreDispatcherPriority.Normal, () =>
                    {
                        hourLabel.Text = hour < 10 ? "0" + hour.ToString() : hour.ToString();
                    });
                    #pragma warning restore CS4014
                }
            }
        }

        /// <summary>
        /// The minutes shown on the clock
        /// </summary>
        public int Minutes
        {
            get
            {
                return minutes;
            }
            set
            {
                if (value != minutes)
                {
                    minutes = value;
                    #pragma warning disable CS4014 // Because this call is not awaited, execution of the current method continues before the call is completed
                    Dispatcher.RunAsync(CoreDispatcherPriority.Normal, () =>
                    {
                        minutesLabel.Text = minutes < 10 ? "0" + minutes.ToString() : minutes.ToString();
                    });
                    #pragma warning restore CS4014
                }
            }
        }

        /// <summary>
        /// The seconds shown on the clock
        /// </summary>
        public int Seconds
        {
            get
            {
                return seconds;
            }
            set
            {
                if (value != seconds)
                {
                    int lastSecondDotSet = seconds;
                    seconds = value;
                    #pragma warning disable CS4014 // Because this call is not awaited, execution of the current method continues before the call is completed
                    Dispatcher.RunAsync(CoreDispatcherPriority.Normal, () =>
                    {
                        secondsLabel.Text = seconds < 10 ? "0" + seconds.ToString() : seconds.ToString();
                        if (seconds > 0)
                        {
                            if (lastSecondDotSet + 1 == seconds)
                            {
                                secondDots[seconds].Visibility = Visibility.Visible;
                            }
                            else
                            {
                                for (int i = 1; i < 60; i++)
                                {
                                    secondDots[i].Visibility = i <= seconds ? Visibility.Visible : Visibility.Collapsed;
                                }
                            }
                        }
                        else
                        {
                            for (int i = 1; i < 60; i++)
                            {
                                secondDots[i].Visibility = Visibility.Collapsed;
                            }
                        }
                    });
                    #pragma warning restore CS4014
                }
            }
        }
        #endregion

        #region Constructor
        /// <summary>
        /// Initialises a new instance of the SingleStudioClock class
        /// </summary>
        public SingleStudioClock()
        {
            // Initialise UI
            this.InitializeComponent();
            // Initialise dictionary of second dots
            secondDots = new Dictionary<int, Ellipse>();
            // Add second dots to dictionary
            secondDots.Add(0, secondDot0);
            secondDots.Add(1, secondDot1);
            secondDots.Add(2, secondDot2);
            secondDots.Add(3, secondDot3);
            secondDots.Add(4, secondDot4);
            secondDots.Add(5, secondDot5);
            secondDots.Add(6, secondDot6);
            secondDots.Add(7, secondDot7);
            secondDots.Add(8, secondDot8);
            secondDots.Add(9, secondDot9);
            secondDots.Add(10, secondDot10);
            secondDots.Add(11, secondDot11);
            secondDots.Add(12, secondDot12);
            secondDots.Add(13, secondDot13);
            secondDots.Add(14, secondDot14);
            secondDots.Add(15, secondDot15);
            secondDots.Add(16, secondDot16);
            secondDots.Add(17, secondDot17);
            secondDots.Add(18, secondDot18);
            secondDots.Add(19, secondDot19);
            secondDots.Add(20, secondDot20);
            secondDots.Add(21, secondDot21);
            secondDots.Add(22, secondDot22);
            secondDots.Add(23, secondDot23);
            secondDots.Add(24, secondDot24);
            secondDots.Add(25, secondDot25);
            secondDots.Add(26, secondDot26);
            secondDots.Add(27, secondDot27);
            secondDots.Add(28, secondDot28);
            secondDots.Add(29, secondDot29);
            secondDots.Add(30, secondDot30);
            secondDots.Add(31, secondDot31);
            secondDots.Add(32, secondDot32);
            secondDots.Add(33, secondDot33);
            secondDots.Add(34, secondDot34);
            secondDots.Add(35, secondDot35);
            secondDots.Add(36, secondDot36);
            secondDots.Add(37, secondDot37);
            secondDots.Add(38, secondDot38);
            secondDots.Add(39, secondDot39);
            secondDots.Add(40, secondDot40);
            secondDots.Add(41, secondDot41);
            secondDots.Add(42, secondDot42);
            secondDots.Add(43, secondDot43);
            secondDots.Add(44, secondDot44);
            secondDots.Add(45, secondDot45);
            secondDots.Add(46, secondDot46);
            secondDots.Add(47, secondDot47);
            secondDots.Add(48, secondDot48);
            secondDots.Add(49, secondDot49);
            secondDots.Add(50, secondDot50);
            secondDots.Add(51, secondDot51);
            secondDots.Add(52, secondDot52);
            secondDots.Add(53, secondDot53);
            secondDots.Add(54, secondDot54);
            secondDots.Add(55, secondDot55);
            secondDots.Add(56, secondDot56);
            secondDots.Add(57, secondDot57);
            secondDots.Add(58, secondDot58);
            secondDots.Add(59, secondDot59);
        }
        #endregion
    }
}
