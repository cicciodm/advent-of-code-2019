import { executeProgram } from "../IntcodeEmulator/emulator";
import { mainProgram } from "./input";

function permutator(inputArr: number[]): number[][] {
  let result = [];

  function permute(arr: number[], m: number[] = []): void {
    if (arr.length === 0) {
      result.push(m);
    } else {
      for (let i = 0; i < arr.length; i++) {
        let curr = arr.slice();
        let next = curr.splice(i, 1);
        permute(curr.slice(), m.concat(next));
      }
    }
  }

  permute(inputArr);

  return result;
}

const phaseSettings = [0, 1, 2, 3, 4];

async function findHighestOutForSettings(
  phaseSettings: number[]
): Promise<void> {
  const allPermutations = permutator(phaseSettings);

  let largestOut = 0;

  for (const permutation of allPermutations) {
    let output = 0;
    for (const phaseSetting of permutation) {
      const [programOutput] = await executeProgram(mainProgram, [
        phaseSetting,
        output
      ]);
      output = programOutput;
    }

    largestOut = output > largestOut ? output : largestOut;
  }

  console.log("Found largestOut", largestOut);
}

findHighestOutForSettings(phaseSettings);
