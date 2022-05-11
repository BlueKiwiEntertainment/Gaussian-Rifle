using System.Text.RegularExpressions;

namespace GaussianRifle
{
    public class Molecule
    {
        public Atom[] atoms;
        public Bond[] bonds;




        //No method for zmatrix hmm
        //Creates a molecule from gaussian16 output file-style input of lines
        //First line is the first atom, second line is the second atom, etc.
        //Final line is the "------..." and contains no attoms
        //This is for constructor purposes, mb override it for zmatrix?
        //After you get all atoms you can find bonds
        /// <summary>
        /// Returns a molecule with atoms, bonds and all for 3D rendering from the lines containing "orientation"
        /// </summary>
        public virtual Atom[] GetAtoms(string orientation, string[] lines)
        {
            bool start = false;
            List<Atom> Atoms = new();

            for (int i = 0; i < lines.Length; i++)
            {
                if (!start && lines[i].Contains(orientation))
                {
                    i += 4;
                    start = true;
                    continue;
                }
                else if (!start)
                {
                    continue;
                }


                if (lines[i].Contains("------"))
                {
                    break;
                }
                else
                {
                    //Split using empty spaces without accounting for extra empty spaces
                    Regex r = new Regex(" +");
                    string[] lineSplit = r.Split(lines[i]);
                    Atom atom = new Atom(int.Parse(lineSplit[2]), new CartesianCoordinates(float.Parse(lineSplit[4]), float.Parse(lineSplit[5]), float.Parse(lineSplit[6])));
                    Atoms.Add(atom);


                }

                
            }
            return Atoms.ToArray();
        }


        //Dear reader do you know if there is a search algorithm that will not iterate molecules n^2 times?
        //How do we find double and tripple bond? Need a list of radiuses for these? Where is such a list? 👀
        // n^2 is not horrible but can always be better.
        /// <summary>
        /// Returns all bonds from its current atoms, gets bond distances from covalent radius and if its smaller than it needs, returns a bond
        /// </summary>  
        public virtual Bond[] GetBonds(Atom[] atoms)
        {
            List<Bond> bonds = new();

            for (int i = 0; i < atoms.Length; i++)
            {
                for (int j = 0; j < atoms.Length; j++)
                {
                    //atom does not bond to itself
                    if(atoms[i] == atoms[j])
                    {
                        continue;
                    }

                    if (bondExistis(atoms[i], atoms[j]))
                    {
                        continue;
                    }

                    //Here we create bond (or not if too far away) This is the place to implement bond types

                    var bond = new Bond(atoms[i], atoms[j]);
                    //Console.Write(bond.getBondLength() + "____");
                    if(bond.getBondLength() <= ((atoms[i].covalentRadius + atoms[j].covalentRadius)*1.3))
                    {

                        //It should probably be bond then
                        bonds.Add(bond);
                    }


                }
            }


            return bonds.ToArray();

            //Self-explanatory
            bool bondExistis(Atom atom1, Atom atom2)
            {
                foreach (var item in bonds)
                {
                    if(item.atom1 == atom1 && item.atom2 == atom2)
                    {
                        return true;
                    }
                    if(item.atom1 == atom2 && item.atom2 == atom1)
                    {
                        return true;
                    }

                }
                return false;
            }
        }
    }



    public class StandardOrientationShape : Molecule
    {

        /// <summary>
        /// Returns a molecule with atoms, bonds and all for 3D rendering from the lines containing "Standard orientation"
        /// </summary>    
        public StandardOrientationShape(string[] lines)
        {

            atoms = GetAtoms("Standard orientation", lines);
            bonds = GetBonds(atoms);

        }

    }

    public class InputOrientationShape : Molecule
    {

        /// <summary>
        /// Returns a molecule with atoms, bonds and all for 3D rendering from the lines containing "Input orientation" I am not sure this works
        /// </summary> 
        public InputOrientationShape(string[] lines)
        {
            atoms = GetAtoms("Input orientation", lines);
            bonds = GetBonds(atoms);
        }
    }



}
