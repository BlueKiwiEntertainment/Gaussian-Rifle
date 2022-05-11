using System.Drawing;

namespace GaussianRifle
{
    public class Atom
    {
        public string symbol;
        public int atomicNumber;
        public CartesianCoordinates coordinates;
        public float covalentRadius;
        public Color CPKColor;


        public Atom(int atomicNumber, CartesianCoordinates coordinates)
        {
            this.symbol = symbolFromAtomicNumber(atomicNumber);
            this.atomicNumber = atomicNumber;
            this.coordinates = coordinates;
            this.covalentRadius = CovalentRadius(atomicNumber);
            this.CPKColor = colorFromAtomicNumber(atomicNumber);
        }

        private string symbolFromAtomicNumber(int n)
        {
            switch (n)
            {
                case 1:
                    return "H";
                case 6:
                    return "C";
                case 7:
                    return "N";
                case 8:
                    return "O";
                case 9:
                    return "F";
                case 15:
                    return "P";
                case 16:
                    return "S";
                case 17:
                    return "Cl";
                case 35:
                    return "Br";
                case 53:
                    return "I";
                default:
                    return "";
            }
        }

        private Color colorFromAtomicNumber(int atomicNumber)
        {
            return CPKColorProvider.CPKColors.TryGetValue(atomicNumber, out Color color) ? color : Color.DeepPink;
        }
            
        private float CovalentRadius(int atomicNumber)
        {
            //This is annoying because it will be looked up for each atom in each iteration
            //Dear reader, do you think we could make it faster with a binary search algorithm? 🤔🤔🤔 Or mb not because the collection magic is fast in C#?
            return CovalentRadiusProvider.covalentRadii.TryGetValue(atomicNumber, out float radius) ? radius : 0.142f;
        }



    }
}

    
    
