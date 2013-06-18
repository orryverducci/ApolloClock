using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Shapes;

namespace ShockClock
{
    /// <summary>
    /// Interaction logic for StudioSettingsWindow.xaml
    /// </summary>
    public partial class StudioSettingsWindow : Window
    {
        public StudioSettingsWindow()
        {
            InitializeComponent();
            studioTextBox.Text = Properties.Settings.Default.Studios.ToString();
        }

        private void Button_Click(object sender, RoutedEventArgs e)
        {
            Close();
        }

        private void Button_Click_1(object sender, RoutedEventArgs e)
        {
            Properties.Settings.Default.Studios = Int32.Parse(studioTextBox.Text);
            Properties.Settings.Default.Save();
            Close();
        }
    }
}
