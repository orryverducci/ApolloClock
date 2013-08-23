using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Windows.Forms;
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
                stopInput = true;
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
            devices = (List<DeviceInstance>)directInput.GetDevices(DeviceClass.GameControl, DeviceEnumerationFlags.AttachedOnly);
            foreach (DeviceInstance device in devices)
            {
                inputComboBox.Items.Add(device.InstanceName);
            }
            if (inputComboBox.Items.Count > 0)
            {
                inputComboBox.SelectedIndex = 0;
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
                    if (state.Offset == JoystickOffset.Buttons1)
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
                    Console.WriteLine(state);
                }
            }
        }

        private void MicLive()
        {
            statusPanel.BackColor = System.Drawing.Color.Red;
        }

        private void MicOff()
        {
            statusPanel.BackColor = System.Drawing.Color.Maroon;
        }
    }
}
