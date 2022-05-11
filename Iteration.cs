namespace GaussianRifle
{
    public class Iteration
    {
        /// <summary>
        /// Iteration is a string[] from "Input orientation" to "Input orientation" or end of the document.
        /// Normaly this will be guassian16 output.
        /// </summary
        public Iteration(string[] contents)
        {

            SCFEnergy = SCFenergy(contents);
            repulsionEnergy = RepulsionEnergy(contents);
            isCalculationFinished = IsCalculationFinished(contents);
            molecule = myMolecule(contents);

        }


        //Implement methods for getting energy, molecular shape etc. This is not optimised because you do multiple passes over the file.
        //Let me know if you know the trick to combine all the methods into a single constructor but also make code clean and open to modifications.
        /// <summary>
        ///  SCF Energy from the line of text containing "SCF Done".
        /// </summary>
        float SCFenergy(string[] contents)
        {
            try
            {
                foreach (var item in contents)
                {
                    if (item.Contains("SCF Done"))
                    {
                        //Split the line to get the energy
                        string[] lineSplit = item.Split(' ');
                        //Return the energy
                        return float.Parse(lineSplit[7]);
                    }
                }
            }
            catch
            {
                return -1f;
            }
            return -1f;

        }
        /// <summary>
        /// Repulsion Energy from the line of text containing "repulsion energy".
        /// </summary>
        float RepulsionEnergy(string[] contents)
        {
            try
            {
                foreach (var item in contents)
                {
                    if (item.Contains("repulsion energy"))
                    {
                        //Split the line to get the energy
                        string[] lineSplit = item.Split(' ');
                        //Return the energy
                        return float.Parse(lineSplit[16]);
                    }
                }
            }
            catch
            {
                return -1f;
            }
            return -1f;
        }
        /// <summary>
        /// Does the iteration contain line "Normal termination of Gaussian"?
        /// </summary> 
        bool IsCalculationFinished(string[] contents)
        {
            foreach (var item in contents)
            {
                if (item.Contains("Normal termination of Gaussian"))
                    return true;
            }
            return false;
        }
        /// <summary>
        /// Molecule in cartesian coords
        /// </summary>
        Molecule? myMolecule(string[] contents)
        {
            if(contents.Any("Standard orientation".Contains))
            {
                return new StandardOrientationShape(contents);
            }
            else if (contents.Contains("Input orientation"))
            {
                return new InputOrientationShape(contents);
            }
            return null;
        }


        
        /// <summary>
        ///  SCF Energy from the line of text containing "SCF Done".
        /// </summary>
        public readonly float SCFEnergy;
        /// <summary>
        /// Repulsion Energy from the line of text containing "repulsion energy".
        /// </summary>
        public readonly float repulsionEnergy;
        /// <summary>
        /// Molecule shape in cartesian coordinates, distance is angstroms.
        /// </summary>
        public readonly Molecule? molecule;
        /// <summary>
        /// Does the iteration contain line "Normal termination of Gaussian"?
        /// </summary>        
        public readonly bool isCalculationFinished;
        

        
    }
}
