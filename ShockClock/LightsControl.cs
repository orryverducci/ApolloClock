using System;
using NetworkCommsDotNet;

namespace ShockClock
{
    static class LightsControl
    {
        /// <summary>
        /// Event for when the studio comes on air
        /// </summary>
        static public event StudioEventHandler StudioOnAir;

        /// <summary>
        /// Event for when the studio goes off air
        /// </summary>
        static public event StudioEventHandler StudioOffAir;

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
        static public event StudioEventHandler EmergencyOn;

        /// <summary>
        /// Event for when emergency output goes off air
        /// </summary>
        static public event StudioEventHandler EmergencyOff;

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
            // Parse command and studio number from received message
            string[] commandParts = message.Split('-');
            int studioNumber = Int32.Parse(commandParts[0]);
            string command = commandParts[1];
            // Execute action for each command
            switch (command)
            {
                case "STUDIO ON":
                    if (StudioOnAir != null)
                    {
                        StudioOnAir(null, new StudioEventArgs(studioNumber));
                    }
                    break;
                case "STUDIO OFF":
                    if (StudioOffAir != null)
                    {
                        StudioOffAir(null, new StudioEventArgs(studioNumber));
                    }
                    break;
                case "MIC LIVE":
                    if (MicLive != null)
                    {
                        MicLive(null, new StudioEventArgs(studioNumber));
                    }
                    break;
                case "MIC OFF":
                    if (MicOff != null)
                    {
                        MicOff(null, new StudioEventArgs(studioNumber));
                    }
                    break;
                case "EMERGENCY ON":
                    if (EmergencyOn != null)
                    {
                        EmergencyOn(null, new StudioEventArgs(studioNumber));
                    }
                    break;
                case "EMERGENCY OFF":
                    if (EmergencyOff != null)
                    {
                        EmergencyOff(null, new StudioEventArgs(studioNumber));
                    }
                    break;
            }
        }
    }
}
