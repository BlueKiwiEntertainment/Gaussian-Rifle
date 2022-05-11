namespace GaussianRifle
{
    public class GaussianRifleSettings
    {
        public string? _gaussianEXEDIR;
        public string? _gaussianSCRDIR;
        public string? _remoteOutputFilePath;      
        public string? _remoteInputFilePath;
        public string? _gaussianHostName;
        public string? _username;
        public string? _password;
        public int _port;
        

        public (bool, string) ValidSettings()
        {
            //Iterate each field in this class
            foreach (var field in this.GetType().GetFields())
            {

                //If the field is null then return false
                if (field.GetValue(this) == null)
                {
                    return (false, field.Name);
                }
            }
            return (true, "");
        }
    }
}
