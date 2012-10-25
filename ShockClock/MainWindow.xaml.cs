using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Timers;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;
using Un4seen.Bass;
using Un4seen.Bass.Misc;

namespace ShockClock
{
    /// <summary>
    /// Interaction logic for MainWindow.xaml
    /// </summary>
    public partial class MainWindow : Window
    {
        /// <summary>
        /// Timer with an intival of 1 millisecond
        /// </summary>
        private Timer timer = new Timer(100);
        /// <summary>
        /// The value of the current second
        /// </summary>
        private int currentSecond;
        private int recordingHandle; // Handle of the recording stream
        private RECORDPROC recordProc = new RECORDPROC(RecordHandler); // Recording Callback
        private DSP_PeakLevelMeter peakLevelMeter; // Peak Level Meter

        public MainWindow()
        {
            InitializeComponent();
            BassNet.Registration("orry@orryverducci.co.uk", "2X24373423243720");
            // Set dll locations
            if (IntPtr.Size == 8) // If running in 64 bit
            {
                Bass.LoadMe("x64");
            }
            else // Else if running in 32 bit
            {
                Bass.LoadMe("x86");
            }
            // Initialise BASS
            if (!Bass.BASS_Init(0, 44100, BASSInit.BASS_DEVICE_DEFAULT, System.IntPtr.Zero)) // If unable to initialise
            {
                // Throw exception
                throw new ApplicationException();
            }
            // Initialise audio input
            if (!Bass.BASS_RecordInit(-1)) // If unable to initialise default input device
            {
                // Throw exception
                throw new ApplicationException();
            }
            // Start recording
            recordingHandle = Bass.BASS_RecordStart(44100, 2, BASSFlag.BASS_SAMPLE_FLOAT, recordProc, IntPtr.Zero);
            // Add Peak Level Meter DSP and Event Handler
            peakLevelMeter = new DSP_PeakLevelMeter(recordingHandle, 1);
            peakLevelMeter.Notification += new EventHandler(PeakLevelMeterNotification);
            // Set initial UI state
            UpdateClock(DateTime.Now.Hour, DateTime.Now.Minute, DateTime.Now.Second);
            for (int i = 0; i <= DateTime.Now.Second; i++)
            {
                UpdateTicks(i);
            }
            // Start timer to update clock each second
            timer.Elapsed += timer_Elapsed;
            timer.Start();
        }

        ~MainWindow()
        {
            // Stop timer
            timer.Stop();
        }

        private void timer_Elapsed(object sender, ElapsedEventArgs e)
        {
            Dispatcher.Invoke(new Action( ()=>
                {
                    // Get current time
                    DateTime time = DateTime.Now;
                    if (time.Second != currentSecond)
                    {
                        currentSecond = time.Second;
                        // Update clock
                        UpdateClock(time.Hour, time.Minute, time.Second);
                        // Update second dots
                        UpdateTicks(time.Second);
                    }
                })
            );
        }

        private void UpdateClock(int hour, int minute, int second)
        {
            string mainText;
            string secondsText;
            string hourText = "";
            if (hour < 10)
            {
                mainText = "0" + hour.ToString();
            }
            else
            {
                mainText = hour.ToString();
            }
            if (minute < 10)
            {
                mainText += ":0" + minute.ToString();
            }
            else
            {
                mainText += ":" + minute.ToString();
            }
            mainClock.Text = mainText;
            if (second < 10)
            {
                secondsText = "0" + second.ToString();
            }
            else
            {
                secondsText = second.ToString();
            }
            secondsClock.Text = secondsText;
            // Write text version of clock
            switch (hour)
            {
                case 1:
                    hourText = "One";
                    break;
                case 2:
                    hourText = "Two";
                    break;
                case 3:
                    hourText = "Three";
                    break;
                case 4:
                    hourText = "Four";
                    break;
                case 5:
                    hourText = "Five";
                    break;
                case 6:
                    hourText = "Six";
                    break;
                case 7:
                    hourText = "Seven";
                    break;
                case 8:
                    hourText = "Eight";
                    break;
                case 9:
                    hourText = "Nine";
                    break;
                case 10:
                    hourText = "Ten";
                    break;
                case 11:
                    hourText = "Eleven";
                    break;
                case 12:
                    hourText = "Twelve";
                    break;
                case 13:
                    hourText = "One";
                    break;
                case 14:
                    hourText = "Two";
                    break;
                case 15:
                    hourText = "Three";
                    break;
                case 16:
                    hourText = "Four";
                    break;
                case 17:
                    hourText = "Five";
                    break;
                case 18:
                    hourText = "Six";
                    break;
                case 19:
                    hourText = "Seven";
                    break;
                case 20:
                    hourText = "Eight";
                    break;
                case 21:
                    hourText = "Nine";
                    break;
                case 22:
                    hourText = "Ten";
                    break;
                case 23:
                    hourText = "Eleven";
                    break;
                case 24:
                    hourText = "Twelve";
                    break;
            }
            if (minute >= 55)
            {
                hourText += " Fifty Five";
            }
            else if (minute >= 50)
            {
                hourText += " Fifty";
            }
            else if (minute >= 45)
            {
                hourText += " Forty Five";
            }
            else if (minute >= 40)
            {
                hourText += " Forty";
            }
            else if (minute >= 35)
            {
                hourText += " Thirty Five";
            }
            else if (minute >= 30)
            {
                hourText = "Half Past " + hourText;
            }
            else if (minute >= 25)
            {
                hourText += " Twenty Five";
            }
            else if (minute >= 20)
            {
                hourText += " Twenty";
            }
            else if (minute >= 15)
            {
                hourText = "Quarter Past " + hourText;
            }
            else if (minute >= 10)
            {
                hourText = "Ten Past " + hourText;
            }
            else if (minute >= 5)
            {
                hourText = "Five Past " + hourText;
            }
            else
            {
                hourText += " O'Clock";
            }
            textClock.Text = hourText;
        }

        private void UpdateTicks(int seconds)
        {
            switch (seconds)
            {
                case 1:
                    secondDot1.Fill = Brushes.Red;
                    break;
                case 2:
                    secondDot2.Fill = Brushes.Red;
                    break;
                case 3:
                    secondDot3.Fill = Brushes.Red;
                    break;
                case 4:
                    secondDot4.Fill = Brushes.Red;
                    break;
                case 5:
                    secondDot5.Fill = Brushes.Red;
                    break;
                case 6:
                    secondDot6.Fill = Brushes.Red;
                    break;
                case 7:
                    secondDot7.Fill = Brushes.Red;
                    break;
                case 8:
                    secondDot8.Fill = Brushes.Red;
                    break;
                case 9:
                    secondDot9.Fill = Brushes.Red;
                    break;
                case 10:
                    secondDot10.Fill = Brushes.Red;
                    break;
                case 11:
                    secondDot11.Fill = Brushes.Red;
                    break;
                case 12:
                    secondDot12.Fill = Brushes.Red;
                    break;
                case 13:
                    secondDot13.Fill = Brushes.Red;
                    break;
                case 14:
                    secondDot14.Fill = Brushes.Red;
                    break;
                case 15:
                    secondDot15.Fill = Brushes.Red;
                    break;
                case 16:
                    secondDot16.Fill = Brushes.Red;
                    break;
                case 17:
                    secondDot17.Fill = Brushes.Red;
                    break;
                case 18:
                    secondDot18.Fill = Brushes.Red;
                    break;
                case 19:
                    secondDot19.Fill = Brushes.Red;
                    break;
                case 20:
                    secondDot20.Fill = Brushes.Red;
                    break;
                case 21:
                    secondDot21.Fill = Brushes.Red;
                    break;
                case 22:
                    secondDot22.Fill = Brushes.Red;
                    break;
                case 23:
                    secondDot23.Fill = Brushes.Red;
                    break;
                case 24:
                    secondDot24.Fill = Brushes.Red;
                    break;
                case 25:
                    secondDot25.Fill = Brushes.Red;
                    break;
                case 26:
                    secondDot26.Fill = Brushes.Red;
                    break;
                case 27:
                    secondDot27.Fill = Brushes.Red;
                    break;
                case 28:
                    secondDot28.Fill = Brushes.Red;
                    break;
                case 29:
                    secondDot29.Fill = Brushes.Red;
                    break;
                case 30:
                    secondDot30.Fill = Brushes.Red;
                    break;
                case 31:
                    secondDot31.Fill = Brushes.Red;
                    break;
                case 32:
                    secondDot32.Fill = Brushes.Red;
                    break;
                case 33:
                    secondDot33.Fill = Brushes.Red;
                    break;
                case 34:
                    secondDot34.Fill = Brushes.Red;
                    break;
                case 35:
                    secondDot35.Fill = Brushes.Red;
                    break;
                case 36:
                    secondDot36.Fill = Brushes.Red;
                    break;
                case 37:
                    secondDot37.Fill = Brushes.Red;
                    break;
                case 38:
                    secondDot38.Fill = Brushes.Red;
                    break;
                case 39:
                    secondDot39.Fill = Brushes.Red;
                    break;
                case 40:
                    secondDot40.Fill = Brushes.Red;
                    break;
                case 41:
                    secondDot41.Fill = Brushes.Red;
                    break;
                case 42:
                    secondDot42.Fill = Brushes.Red;
                    break;
                case 43:
                    secondDot43.Fill = Brushes.Red;
                    break;
                case 44:
                    secondDot44.Fill = Brushes.Red;
                    break;
                case 45:
                    secondDot45.Fill = Brushes.Red;
                    break;
                case 46:
                    secondDot46.Fill = Brushes.Red;
                    break;
                case 47:
                    secondDot47.Fill = Brushes.Red;
                    break;
                case 48:
                    secondDot48.Fill = Brushes.Red;
                    break;
                case 49:
                    secondDot49.Fill = Brushes.Red;
                    break;
                case 50:
                    secondDot50.Fill = Brushes.Red;
                    break;
                case 51:
                    secondDot51.Fill = Brushes.Red;
                    break;
                case 52:
                    secondDot52.Fill = Brushes.Red;
                    break;
                case 53:
                    secondDot53.Fill = Brushes.Red;
                    break;
                case 54:
                    secondDot54.Fill = Brushes.Red;
                    break;
                case 55:
                    secondDot55.Fill = Brushes.Red;
                    break;
                case 56:
                    secondDot56.Fill = Brushes.Red;
                    break;
                case 57:
                    secondDot57.Fill = Brushes.Red;
                    break;
                case 58:
                    secondDot58.Fill = Brushes.Red;
                    break;
                case 59:
                    secondDot59.Fill = Brushes.Red;
                    break;
                default:
                    secondDot1.Fill = Brushes.Black;
                    secondDot2.Fill = Brushes.Black;
                    secondDot3.Fill = Brushes.Black;
                    secondDot4.Fill = Brushes.Black;
                    secondDot5.Fill = Brushes.Black;
                    secondDot6.Fill = Brushes.Black;
                    secondDot7.Fill = Brushes.Black;
                    secondDot8.Fill = Brushes.Black;
                    secondDot9.Fill = Brushes.Black;
                    secondDot10.Fill = Brushes.Black;
                    secondDot11.Fill = Brushes.Black;
                    secondDot12.Fill = Brushes.Black;
                    secondDot13.Fill = Brushes.Black;
                    secondDot14.Fill = Brushes.Black;
                    secondDot15.Fill = Brushes.Black;
                    secondDot16.Fill = Brushes.Black;
                    secondDot17.Fill = Brushes.Black;
                    secondDot18.Fill = Brushes.Black;
                    secondDot19.Fill = Brushes.Black;
                    secondDot20.Fill = Brushes.Black;
                    secondDot21.Fill = Brushes.Black;
                    secondDot22.Fill = Brushes.Black;
                    secondDot23.Fill = Brushes.Black;
                    secondDot24.Fill = Brushes.Black;
                    secondDot25.Fill = Brushes.Black;
                    secondDot26.Fill = Brushes.Black;
                    secondDot27.Fill = Brushes.Black;
                    secondDot28.Fill = Brushes.Black;
                    secondDot29.Fill = Brushes.Black;
                    secondDot30.Fill = Brushes.Black;
                    secondDot31.Fill = Brushes.Black;
                    secondDot32.Fill = Brushes.Black;
                    secondDot33.Fill = Brushes.Black;
                    secondDot34.Fill = Brushes.Black;
                    secondDot35.Fill = Brushes.Black;
                    secondDot36.Fill = Brushes.Black;
                    secondDot37.Fill = Brushes.Black;
                    secondDot38.Fill = Brushes.Black;
                    secondDot39.Fill = Brushes.Black;
                    secondDot40.Fill = Brushes.Black;
                    secondDot41.Fill = Brushes.Black;
                    secondDot42.Fill = Brushes.Black;
                    secondDot43.Fill = Brushes.Black;
                    secondDot44.Fill = Brushes.Black;
                    secondDot45.Fill = Brushes.Black;
                    secondDot46.Fill = Brushes.Black;
                    secondDot47.Fill = Brushes.Black;
                    secondDot48.Fill = Brushes.Black;
                    secondDot49.Fill = Brushes.Black;
                    secondDot50.Fill = Brushes.Black;
                    secondDot51.Fill = Brushes.Black;
                    secondDot52.Fill = Brushes.Black;
                    secondDot53.Fill = Brushes.Black;
                    secondDot54.Fill = Brushes.Black;
                    secondDot55.Fill = Brushes.Black;
                    secondDot56.Fill = Brushes.Black;
                    secondDot57.Fill = Brushes.Black;
                    secondDot58.Fill = Brushes.Black;
                    secondDot59.Fill = Brushes.Black;
                    break;
            }
        }

        #region Audio input
        /// <summary>
        /// Stub recording callback function
        /// </summary>
        /// <param name="handle">Handle of the recording stream</param>
        /// <param name="buffer">Recording buffer</param>
        /// <param name="length">Length of buffer</param>
        /// <param name="user">User parameters</param>
        /// <returns></returns>
        private static bool RecordHandler(int handle, IntPtr buffer, int length, IntPtr user)
        {
            return true;
        }

        /// <summary>
        /// Triggers event sending peak level meter values
        /// </summary>
        /// <param name="sender">Sending Object</param>
        /// <param name="e">Event argument</param>
        public void PeakLevelMeterNotification(object sender, EventArgs e)
        {
            Dispatcher.Invoke(new Action(() =>
                {
                    double height = ((Panel)Application.Current.MainWindow.Content).ActualHeight - 189;
                    leftMetre.Height = Math.Pow(10, peakLevelMeter.LevelL_dBV / 20) * height;
                    rightMetre.Height = Math.Pow(10, peakLevelMeter.LevelR_dBV / 20) * height;
                }));
        }
        #endregion

        private void Window_Closing_1(object sender, System.ComponentModel.CancelEventArgs e)
        {
            timer.Elapsed -= timer_Elapsed;
            peakLevelMeter.Notification -= PeakLevelMeterNotification;
        }

        private void Window_StateChanged_1(object sender, EventArgs e)
        {
            if (WindowState == WindowState.Maximized)
            {
                WindowStyle = WindowStyle.None;
                ResizeMode = ResizeMode.NoResize;
            }
            else
            {
                WindowStyle = WindowStyle.SingleBorderWindow;
                ResizeMode = ResizeMode.CanResize;
            }
        }

        private void Window_PreviewKeyDown_1(object sender, KeyEventArgs e)
        {
            if (e.Key == Key.Escape)
            {
                WindowState = WindowState.Normal;
            }
        }
    }
}
