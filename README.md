# GaussianRifle

GaussianRifle is a library for automating Gaussian16 and reading its outputs. Includes a utility for rendering and animating molecules.

## Installation

Use NuGet package:
https://www.nuget.org/packages/GaussianRifle/1.0.0
```bash
dotnet add package GaussianRifle --version 1.0.0
```
...or copy the class library into your project.

## Usage
On linux machine ensure Gaussian16 is installed. Gaussian16 is a commercial software and can be purchased here:
https://gaussian.com/gaussian16/

Your linux machine should accept SSH connections:

```bash
sudo apt-get update
sudo apt-get install openssh-server
sudo ufw allow 22
```

```cs
//Specify directories in settings or leave as blank if you want to handle connection manually
var settings = new GaussianRifleSettings
{
    _remoteOutputFilePath = "/home/user/opt/gaussian/output/output.log",
    _gaussianEXEDIR = "/home/user/opt/gaussian/g16",
    _gaussianSCRDIR = "/home/user/opt/gaussian/scr",
    _remoteInputFilePath = "/home/user/opt/gaussian/input/test.inp",
    _gaussianHostName = "hostname",
    _username = "username",
    _password = "password",
    _port = 22,
    
};
//Instantiate the manager using the settings
GaussianRifle.GaussianRifle gaussian = new(settings);


//Upload from string or textfile
gaussian.UploadLinesRemote(text.Split(Environment.NewLine), "/home/user/opt/gaussian/input/test.inp");
//Run calculation, can specify custom commands using brackets, otherwise it will be

        void addCommands()
        {
            myCommandsSet.Add($"export GAUSS_SCRDIR={_gaussianSCRDIR}");
            myCommandsSet.Add($"export GAUSS_EXEDIR={_gaussianEXEDIR}");
            myCommandsSet.Add("chmod -R 700 $GAUSS_EXEDIR");
            myCommandsSet.Add($"$GAUSS_EXEDIR/g16 {_remoteInputFilePath} {_remoteOutputFilePath}");

        }

gaussian.RunCalculation();


```
## Rendering molecules in three.js
```js
//moleculeToAniamte takes an array of molecules as json.

var moleculeToAnimate = function (jsonMoleculeArray){

	//Clear all animations
	allAnimations = [];
    //Clear molecule
	moleculeAtomsGroup.children = [];
	moleculeBondsGroup.children = [];
    
    
	var molecules = JSON.parse(jsonMoleculeArray);
...
}
```
Can be called from Blazor:
```cs
        GaussianRifle gaussian = new(settings);


        List <Molecule> moleculesList = new();

        foreach (var item in gaussian.outputFromFile(gassianOutputCache))
        {    

            moleculesList.Add(item.molecule);
        }



        if(gassianOutputCache != null)
        {
            var molecule = JsonConvert.SerializeObject(moleculesList.ToArray());    


            var result = await JSRuntime.InvokeAsync<object>("moleculeToAnimate", molecule);
        }
```
You can find an example on here:

www.exmachinasoft.com


## Contributing
Pull requests are welcome.

## License
[GPL-3]

## Contact
contact@exmachinasoft.com
