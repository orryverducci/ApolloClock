using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Runtime.InteropServices.WindowsRuntime;
using Windows.Foundation;
using Windows.Foundation.Collections;
using Windows.UI;
using Windows.UI.ViewManagement;
using Windows.UI.Xaml;
using Windows.UI.Xaml.Controls;
using Windows.UI.Xaml.Controls.Primitives;
using Windows.UI.Xaml.Data;
using Windows.UI.Xaml.Input;
using Windows.UI.Xaml.Media;
using Windows.UI.Xaml.Navigation;
using ApolloClock.Core;

namespace ApolloClock.Windows
{
    /// <summary>
    /// An empty page that can be used on its own or navigated to within a Frame.
    /// </summary>
    public sealed partial class MainPage : Page, IDisposable
    {
        /// <summary>
        /// The clock display class for this clock
        /// </summary>
        private ClockDisplay clockDisplay;

        /// <summary>
        /// List of all the panels shown on the display
        /// </summary>
        private List<object> displayPanels;

        /// <summary>
        /// Constructor for main page of the application
        /// </summary>
        public MainPage()
        {
            // Initialise UI components
            this.InitializeComponent();
            // Initialise display planels list
            displayPanels = new List<object>();
            // Retrieve the application title bar and change its colour
            ApplicationViewTitleBar titleBar = ApplicationView.GetForCurrentView().TitleBar;
            titleBar.BackgroundColor = Color.FromArgb(255, 244, 67, 54);
            titleBar.InactiveBackgroundColor = Color.FromArgb(255, 244, 67, 54);
            titleBar.ButtonBackgroundColor = Color.FromArgb(255, 244, 67, 54);
            titleBar.ButtonInactiveBackgroundColor = Color.FromArgb(255, 244, 67, 54);
            titleBar.ButtonHoverBackgroundColor = Color.FromArgb(255, 229, 57, 53);
            titleBar.ButtonPressedBackgroundColor = Color.FromArgb(255, 211, 47, 47);
            titleBar.ForegroundColor = Colors.White;
            titleBar.InactiveForegroundColor = Color.FromArgb(255, 255, 205, 210);
            titleBar.ButtonForegroundColor = Colors.White;
            titleBar.ButtonInactiveForegroundColor = Color.FromArgb(255, 255, 205, 210);
            titleBar.ButtonHoverForegroundColor = Colors.White;
            titleBar.ButtonPressedForegroundColor = Colors.White;
            // Create clock display class
            clockDisplay = new ClockDisplay();
            // Subscribe to clock display events
            clockDisplay.ClockChange += ClockDisplay_ClockChange;
        }

        /// <summary>
        /// Releases all resources used by the current instance of MainPage
        /// </summary>
        public void Dispose()
        {
            clockDisplay.Dispose();
        }

        /// <summary>
        /// On navigation to the page
        /// </summary>
        /// <param name="e">Navigation event arguments</param>
        protected override void OnNavigatedTo(NavigationEventArgs e)
        {
            // Run parent implementation
            base.OnNavigatedTo(e);
            // Create the clock
            SingleStudioClock clock = new SingleStudioClock();
            Grid.SetColumn(clock, 1);
            Grid.SetRow(clock, 1);
            mainGrid.Children.Add(clock);
            // Add clock to display panels list
            displayPanels.Add(clock);
            // Set time on all panels
            ClockDisplay_ClockChange(this, null);
        }

        /// <summary>
        /// Clock change event handler, sends the current time to all the panels
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void ClockDisplay_ClockChange(object sender, EventArgs e)
        {
            foreach (object panel in displayPanels)
            {
                if (panel is IClock)
                {
                    ((IClock)panel).Hour = clockDisplay.ClockHour;
                    ((IClock)panel).Minutes = clockDisplay.ClockMinutes;
                    ((IClock)panel).Seconds = clockDisplay.ClockSeconds;
                }
            }
        }
    }
}
