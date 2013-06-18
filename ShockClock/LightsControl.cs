using System;
using NetworkCommsDotNet;

namespace ShockClock
{
    static class LightsControl
    {
        /// <summary>
        /// Event for when the studio comes on air
        /// </summary>
        static public event EventHandler StudioOnAir;

        /// <summary>
        /// Event for when the studio goes off air
        /// </summary>
        static public event EventHandler StudioOffAir;

        /// <summary>
        /// Event for when a mic goes live
        /// </summary>
        static public event EventHandler MicLive;

        /// <summary>
        /// Event for when a mic is switched off
        /// </summary>
        static public event EventHandler MicOff;

        /// <summary>
        /// Event for when emergency output goes on air
        /// </summary>
        static public event EventHandler EmergencyOn;

        /// <summary>
        /// Event for when emergency output goes off air
        /// </summary>
        static public event EventHandler EmergencyOff;

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

        static private void IncomingMessage(PacketHeader header, Connection connection, string command)
        {
            // Execute action for each command
            switch (command)
            {
                case "STUDIO ON":
                    if (StudioOnAir != null)
                    {
                        StudioOnAir(null, new EventArgs());
                    }
                    break;
                case "STUDIO OFF":
                    if (StudioOffAir != null)
                    {
                        StudioOffAir(null, new EventArgs());
                    }
                    break;
                case "MIC LIVE":
                    if (MicLive != null)
                    {
                        MicLive(null, new EventArgs());
                    }
                    break;
                case "MIC OFF":
                    if (MicOff != null)
                    {
                        MicOff(null, new EventArgs());
                    }
                    break;
                case "EMERGENCY ON":
                    if (EmergencyOn != null)
                    {
                        EmergencyOn(null, new EventArgs());
                    }
                    break;
                case "EMERGENCY OFF":
                    if (EmergencyOff != null)
                    {
                        EmergencyOff(null, new EventArgs());
                    }
                    break;
            }
        }
    }
}
