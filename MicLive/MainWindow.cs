using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Windows.Forms;
using NetworkCommsDotNet;
using SharpDX;
using SharpDX.DirectInput;

namespace MicLive
{
    public partial class MainWindow : Form
    {
        private DirectInput directInput = new DirectInput();
        private List<DeviceInstance> devices;
        private Joystick joystick;
        private Thread inputThread;
        private bool stopInput = false;
        bool close = false;

        public MainWindow()
        {
            InitializeComponent();
        }

        private void MainWindow_FormClosing(object sender, FormClosingEventArgs e)
        {
            if (!close)
            {
                e.Cancel = true;
                notifyIcon.Visible = true;
                Visible = false;
            }
            else
            {
                if (joystick != null)
                {
                    stopInput = true;
                    joystick.Unacquire();
                    joystick = null;
                }
                NetworkComms.Shutdown();
                Properties.Settings.Default.HostName = ipTextBox.Text;
                Properties.Settings.Default.InputDevice = (string)inputComboBox.SelectedItem;
                Properties.Settings.Default.Studio = studioComboBox.SelectedIndex + 1;
            }
        }

        private void openMenuItem_Click(object sender, EventArgs e)
        {
            DisplayForm();
        }

        private void exitMenuItem_Click(object sender, EventArgs e)
        {
            close = true;
            Close();
        }

        private void notifyIcon_MouseDoubleClick(object sender, MouseEventArgs e)
        {
            DisplayForm();
        }

        private void DisplayForm()
        {
            Visible = true;
            notifyIcon.Visible = false;
        }

        private void MainWindow_Load(object sender, EventArgs e)
        {
            ipTextBox.Text = Properties.Settings.Default.HostName;
            studioComboBox.SelectedIndex = Properties.Settings.Default.Studio - 1;
            devices = (List<DeviceInstance>)directInput.GetDevices(DeviceClass.GameControl, DeviceEnumerationFlags.AttachedOnly);
            foreach (DeviceInstance device in devices)
            {
                inputComboBox.Items.Add(device.InstanceName);
            }
            if (inputComboBox.Items.Count > 0)
            {
                int initialDevice = inputComboBox.FindStringExact(Properties.Settings.Default.InputDevice);
                if (initialDevice != -1)
                {
                    inputComboBox.SelectedIndex = initialDevice;
                }
                else
                {
                    inputComboBox.SelectedIndex = 0;
                }
            }
        }

        private void inputComboBox_SelectedIndexChanged(object sender, EventArgs e)
        {
            if (joystick != null)
            {
                stopInput = true;
                joystick.Unacquire();
                joystick = null;
            }
            DeviceInstance device = devices.Find(i => i.InstanceName == (string)inputComboBox.SelectedItem);
            if (device != null)
            {
                joystick = new Joystick(directInput, device.InstanceGuid);
                joystick.Properties.BufferSize = 128;
                joystick.Acquire();
            }
            stopInput = false;
            inputThread = new Thread(ProcessInput);
            inputThread.Start();
        }

        private void ProcessInput()
        {
            while (!stopInput)
            {
                var stateData = joystick.GetBufferedData();
                foreach (var state in stateData)
                {
                    if (state.Offset == JoystickOffset.Buttons0)
                    {
                        if (state.Value > 0)
                        {
                            MicLive();
                        }
                        else
                        {
                            MicOff();
                        }
                    }
                }
            }
        }

        private void MicLive()
        {
            try
            {
                studioComboBox.Invoke((MethodInvoker)(() =>
                {
                    IPAddress[] clockIP = Dns.GetHostAddresses(ipTextBox.Text);
                    NetworkComms.SendObject("Message", clockIP[0].ToString(), 10000, "MIC LIVE - " + studioComboBox.Text);
                }));
            }
            catch { }
            statusPanel.BackColor = System.Drawing.Color.Red;
        }

        private void MicOff()
        {
            try
            {
                studioComboBox.Invoke((MethodInvoker)(() =>
                {
                    IPAddress[] clockIP = Dns.GetHostAddresses(ipTextBox.Text);
                    NetworkComms.SendObject("Message", clockIP[0].ToString(), 10000, "MIC OFF - " + studioComboBox.Text);
                }));
            }
            catch { }
            statusPanel.BackColor = System.Drawing.Color.Maroon;
        }
    }
}
