using System.Numerics;

namespace GaussianRifle
{
    public class Bond
    {
        public Bond(Atom atom1, Atom atom2)
        {
            this.atom1 = atom1;
            this.atom2 = atom2;
        }

        public Atom atom1;
        public Atom atom2;


        //Returns bond length in angstroms based on cartesian coordinates of atoms
        public float getBondLength()
        {
            var point1 = new Vector3(atom1.coordinates.x, atom1.coordinates.y, atom1.coordinates.z);
            var point2 = new Vector3(atom2.coordinates.x, atom2.coordinates.y, atom2.coordinates.z);


            return Vector3.Distance(point1, point2);
        }


        
    }



}
