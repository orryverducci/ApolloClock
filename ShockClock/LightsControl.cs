using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Sockets;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace ShockClock
{
    static class LightsControl
    {
        /// <summary>
        /// Listens for TCP connections from any network interface on port 7000
        /// </summary>
        static private TcpListener listener = new TcpListener(System.Net.IPAddress.Any, 7000);

        /// <summary>
        /// Thread to carry out client tasks
        /// </summary>
        static private Thread serviceThread;

        /// <summary>
        /// Socket used for client connection
        /// </summary>
        static private Socket clientSocket;

        /// <summary>
        /// Stream used for network communcation
        /// </summary>
        static private Stream communicationStream;

        /// <summary>
        /// Stream reader for communication stream
        /// </summary>
        static private StreamReader streamReader;

        /// <summary>
        /// Stream write for communcation stream
        /// </summary>
        static private StreamWriter streamWriter;

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
            // Start listening for connections
            listener.Start();
            // Create and start thread to carry out client tasks
            serviceThread = new Thread(new ThreadStart(RemoteService));
            serviceThread.Start();
        }

        static public void Stop()
        {
            serviceThread.Abort();
        }

        static private void RemoteService()
        {
            while (true)
            {
                // Accept client connection
                clientSocket = listener.AcceptSocket();
                // Setup stream
                communicationStream = new NetworkStream(clientSocket);
                streamReader = new StreamReader(communicationStream);
                streamWriter = new StreamWriter(communicationStream);
                // While loop to carry out communcation
                bool active = true;
                while (active)
                {
                    // Read the command
                    string command = streamReader.ReadLine();
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
                        case "EXIT":
                            // Client is exiting, close communcation
                            active = false;
                            break;
                        default:
                            // Invalid response received, ignore
                            break;
                    }
                }
                // Close socket at the end of communcation
                clientSocket.Close();
            }
        }
    }
}
