using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GaussianRifle
{
    public class OutputHandler
    {
        /// <summary>
        /// gets all the iterations as list of string arrays from the output file as string[]
        /// </summary>
        public List<Iteration> getAllIterations(string[] outputFileLines)
        {
            List<Iteration> result = new();
            List<string> temp = new();
            for (int i = 0; i < outputFileLines.Length; i++)
            {
                temp.Add(outputFileLines[i]);
                if (outputFileLines[i].Contains("Input orientation"))
                {
                    var iteration = new Iteration(temp.ToArray());
                    if (iteration.molecule != null)
                        result.Add(iteration);
                    
                    temp.Clear();
                    temp.Add(outputFileLines[i]);
                }

            }
            List<Iteration> result2 = new();
            foreach (var item in result)
            {
                if(item.molecule.atoms != null && item.molecule.atoms.Length != 0)
                    result2.Add(item);

            }
            
            return result2;

        }

    }
}
