using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Renci.SshNet;


namespace GaussianRifle
{
    public class SSHManager
    {

        ConnectionInfo? myConnectionInfo;

        public SSHManager(string host, string username, string password, int port)
        {

            var method = new PasswordAuthenticationMethod(username, password);
            //Create connection info
            var connectionInfo = new ConnectionInfo(host, port, username, method);

            myConnectionInfo = connectionInfo;


        }


        public void ExecuteCommand(string command)
        {
            using (var client = new SshClient(myConnectionInfo))
            {
                client.Connect();
                var result = client.RunCommand(command);
                Console.WriteLine(result.Result);
                client.Disconnect();
            }
        }
        //This will be mostly used for configuration of the Guassian16 prior to experiment. You can get rid of the boilerplate if you want to set enviroments in
        //your linux server manually.
        public void ExecuteMultipleCommands(List<string> commands)
        {
            using (var client = new SshClient(myConnectionInfo))
            {
                client.Connect();
                string cmde = "";
                foreach (var command in commands)
                {
                    cmde += command + ";" + "\n";

                }
                var cmd = client.CreateCommand(cmde);
                cmd.BeginExecute();
                Console.WriteLine("Command>" + cmd.CommandText);
                Console.WriteLine("Return Value = {0}", cmd.Result);
                client.Disconnect();
            }
        }

        //This will be for uploading files to the input directory of the Gaussian16.
        public string UploadFile(string filePath, string remoteFolder)
        {


            using (var sftp = new SftpClient(myConnectionInfo))
            {

                sftp.Connect();
                using (var uplfileStream = System.IO.File.OpenRead(filePath))
                {
                    sftp.UploadFile(uplfileStream, remoteFolder, true);
                }
                sftp.Disconnect();
            }
            //Return name of the file in the new location
            return remoteFolder + System.IO.Path.GetFileName(filePath);
        }


        //This will be for downloading files from the output directory of the Gaussian16 and/or streaming output
        public string DownloadFile(string remoteFile, string localPath)
        {
            //If the local file exists - delete it
            if (System.IO.File.Exists(localPath + "/" + System.IO.Path.GetFileName(remoteFile)))
            {
                System.IO.File.Delete(localPath + "/" + System.IO.Path.GetFileName(remoteFile));
            }

            try
            {
                using (var sftp = new SftpClient(myConnectionInfo))
                {

                    sftp.Connect();
                    using (var downFileStream = File.OpenWrite(localPath + "/" + System.IO.Path.GetFileName(remoteFile)))
                    {
                        sftp.DownloadFile(remoteFile, downFileStream);

                    }

                    sftp.Disconnect();
                }
            }
            catch (Exception)
            {
                //Sometimes gets no host found when making consecutive downloads from the same server.

            }


            //return filename in the local directory
            return localPath + System.IO.Path.GetFileName(remoteFile);
        }

        public string[]? ReadRemoteLines(string remoteFilePath)
        {
            string[]? result = null;
            try
            {
                using (var sftp = new SftpClient(myConnectionInfo))
                {

                    sftp.Connect();
                    result = sftp.ReadAllLines(remoteFilePath);

                    sftp.Disconnect();
                }
            }
            catch (Exception)
            {
                //Sometimes gets no host found when making consecutive downloads from the same server.

            }


            //return filename in the local directory
            return result;
        }

        public string UploadLinesRemote(string[] lines, string remoteFilePath)
        {
            var bytes = Encoding.ASCII.GetBytes(string.Join("\n", lines));


            using (var sftp = new SftpClient(myConnectionInfo))
            {
                sftp.Connect();

                

                sftp.Create(remoteFilePath);

                sftp.WriteAllLines(remoteFilePath, lines);
                sftp.Disconnect();


            }

            return remoteFilePath;
        }

    }
}