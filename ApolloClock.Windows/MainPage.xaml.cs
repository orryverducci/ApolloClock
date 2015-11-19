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

// The Blank Page item template is documented at http://go.microsoft.com/fwlink/?LinkId=402352&clcid=0x409

namespace ApolloClock.Windows
{
    /// <summary>
    /// An empty page that can be used on its own or navigated to within a Frame.
    /// </summary>
    public sealed partial class MainPage : Page
    {
        /// <summary>
        /// Constructor for main page of the application
        /// </summary>
        public MainPage()
        {
            // Initialise UI components
            this.InitializeComponent();
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
        }
    }
}
