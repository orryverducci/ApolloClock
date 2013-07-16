using System;
using System.Diagnostics;
using NetworkCommsDotNet;

namespace ShockClock
{
    static class LightsControl
    {
        /// <summary>
        /// Event for when a studio comes on air
        /// </summary>
        static public event StudioEventHandler StudioOnAir;

        /// <summary>
        /// Event for when a mic goes live
        /// </summary>
        static public event StudioEventHandler MicLive;

        /// <summary>
        /// Event for when a mic is switched off
        /// </summary>
        static public event StudioEventHandler MicOff;

        /// <summary>
        /// Event for when emergency output goes on air
        /// </summary>
        static public event EventHandler EmergencyOn;

        static public void Initialise()
        {
            // Setup network communications
            NetworkComms.AppendGlobalIncomingPacketHandler<string>("Message", IncomingMessage);
            // Start listening for connections
            TCPConnection.StartListening(true);
        }

        static public void Stop()
        {
            NetworkComms.Shutdown();
        }

        static private void IncomingMessage(PacketHeader header, Connection connection, string message)
        {
            // Parse studio number
            int studioNumber = ParseStudioNumber(message);
            // Execute action for each command
            if (message == "EMERGENCY") // If emergency output has come on
            {
                if (EmergencyOn != null)
                {
                    EmergencyOn(null, new EventArgs());
                }
            }
            else if (message.StartsWith("STUDIO"))
            {
                if (StudioOnAir != null)
                {
                    StudioOnAir(null, new StudioEventArgs(studioNumber));
                }
            }
            else if (message.StartsWith("MIC LIVE"))
            {
                if (MicLive != null)
                {
                    MicLive(null, new StudioEventArgs(studioNumber));
                }
            }
            else if (message.StartsWith("MIC OFF"))
            {
                if (MicOff != null)
                {
                    MicOff(null, new StudioEventArgs(studioNumber));
                }
            }
        }

        static private int ParseStudioNumber(string command)
        {
            Debug.WriteLine(command);
            // Split command if possible
            string[] commandParts = command.Split('-');
            // If command has been split, parse studio number
            if (commandParts.Length > 1)
            {
                Debug.WriteLine(commandParts[1]);
                return Int32.Parse(commandParts[1]);
            }
            else
            {
                return default(int);
            }
        }
    }
}
