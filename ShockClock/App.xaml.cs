using System.Windows;

namespace ShockClock
{
    /// <summary>
    /// Interaction logic for App.xaml
    /// </summary>
    public partial class App : Application
    {
        private void Application_Startup(object sender, StartupEventArgs e)
        {
            // Initialise network
            LightsControl.Initialise();
            // Open windows
            for (int i = 0; i < ShockClock.Properties.Settings.Default.Studios; i++)
            {
                MainWindow window = new MainWindow(i + 1);
                window.Show();
            }
        }

        private void Application_Exit(object sender, ExitEventArgs e)
        {
            // Kill sockets
            LightsControl.Stop();
        }
    }
}
