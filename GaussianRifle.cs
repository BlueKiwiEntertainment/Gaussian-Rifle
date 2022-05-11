using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace GaussianRifle
{
    public class GaussianRifle
    {


        #region connInfo
        string _gaussianHostName;
        string _username;
        string _password;
        int _port;
        #endregion

        #region fileDirs
        string _gaussianEXEDIR;
        string _gaussianSCRDIR;

        string _remoteOutputFilePath;
        string _remoteInputFilePath;


        #endregion

        #region commandCrafter
        List<string> myCommandsSet = new();
        void addCommands()
        {
            myCommandsSet.Add($"export GAUSS_SCRDIR={_gaussianSCRDIR}");
            myCommandsSet.Add($"export GAUSS_EXEDIR={_gaussianEXEDIR}");
            myCommandsSet.Add("chmod -R 700 $GAUSS_EXEDIR");
            myCommandsSet.Add($"$GAUSS_EXEDIR/g16 {_remoteInputFilePath} {_remoteOutputFilePath}");

        }
        #endregion
        public GaussianRifle(GaussianRifleSettings settings, params string[] commands)
        {
            //Check we have all the settings
            if(!settings.ValidSettings().Item1 || settings._port == 0)
            {
                throw new Exception("Invalid or missing settings: " + settings.ValidSettings().Item2);
            }
            
            try
            {
                //Iterate each field in the settings and do the reflection stuff to transfer the settings over
                foreach (FieldInfo field in this.GetType().GetFields(BindingFlags.NonPublic |
                         BindingFlags.Instance))
                {

                    if (settings.GetType().GetFields().Any(x => x.Name == field.Name))
                    {
                        
                        field.SetValue(this, settings.GetType().GetFields().First(x => x.Name == field.Name).GetValue(settings));
                    }

                }

            }
            catch (Exception)
            {

                throw new Exception("Invalid or missing settings");
            }

            //If no commands are passed in, add the default commands
            if (commands != null)
            {
                addCommands();
            }
            else//This can just fail if commands are invalid 🤷
            {
                foreach (var item in commands)
                {
                    myCommandsSet.Add(item);
                }
            }

            spawnManager();
        }


        SSHManager SSH;
        
        void spawnManager()
        {
            SSH = new SSHManager(_gaussianHostName, _username, _password, _port);

        }

        /// <summary>
        /// Downloads file from remote server
        /// </summary>
        public string DownloadFile(string remoteFilePath, string localPath)
        {
            return SSH.DownloadFile(remoteFilePath, localPath);
        }

        /// <summary>
        /// Reads output and returns all the iterations therein.
        /// </summary>
        public List<Iteration> outputFromFile(string[] file)
        {
            return new OutputHandler().getAllIterations(file);
        }
        /// <summary>
        /// Gets iteration from remote location via SSH.
        /// </summary>
        public List<Iteration> outputFromRemoteFile(string remoteFilePath)
        {
            return new OutputHandler().getAllIterations(SSH.ReadRemoteLines(remoteFilePath));
        }

        /// <summary>
        /// file should be a valid Guassian input file. 
        /// delivers the payload to target location via SSH. 
        /// </summary>        
        public void UploadLinesRemote(string[] file, string remotePath)
        {
            SSH.UploadLinesRemote(file, remotePath);
        }


        /// <summary>
        /// Set of SSH commands to run the gaussian calculation.
        /// </summary>
        public void RunCalculation()
        {
            SSH.ExecuteMultipleCommands(myCommandsSet);
        }


    }
    
}

