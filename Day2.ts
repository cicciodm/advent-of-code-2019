const mainProgram = [
    1,
    0,
    0,
    3,
    1,
    1,
    2,
    3,
    1,
    3,
    4,
    3,
    1,
    5,
    0,
    3,
    2,
    6,
    1,
    19,
    2,
    19,
    13,
    23,
    1,
    23,
    10,
    27,
    1,
    13,
    27,
    31,
    2,
    31,
    10,
    35,
    1,
    35,
    9,
    39,
    1,
    39,
    13,
    43,
    1,
    13,
    43,
    47,
    1,
    47,
    13,
    51,
    1,
    13,
    51,
    55,
    1,
    5,
    55,
    59,
    2,
    10,
    59,
    63,
    1,
    9,
    63,
    67,
    1,
    6,
    67,
    71,
    2,
    71,
    13,
    75,
    2,
    75,
    13,
    79,
    1,
    79,
    9,
    83,
    2,
    83,
    10,
    87,
    1,
    9,
    87,
    91,
    1,
    6,
    91,
    95,
    1,
    95,
    10,
    99,
    1,
    99,
    13,
    103,
    1,
    13,
    103,
    107,
    2,
    13,
    107,
    111,
    1,
    111,
    9,
    115,
    2,
    115,
    10,
    119,
    1,
    119,
    5,
    123,
    1,
    123,
    2,
    127,
    1,
    127,
    5,
    0,
    99,
    2,
    14,
    0,
    0
]

const EXIT_OPCODE = 99;
const SUM_OPCODE = 1;
const MULTIPLY_OPCODE = 2;

const STEP_SIZE = 4;

function executeProgramWithInputs(program: number[], noun: number, verb: number): number[] {
  const programCopy = [...program];

  programCopy[1] = noun;
  program[2] = verb;

  return executeProgram(programCopy);
}

function executeProgram(program: number[]): number[] {
  const programCopy = [...program];
  let currentIndex = 0;
  let currentOpcode = programCopy[currentIndex];
  
  while (currentOpcode !== EXIT_OPCODE) {
    // Read
    const op1Address = programCopy[currentIndex + 1];
    const op2Address = programCopy[currentIndex + 2];
  
  
    if (op1Address === undefined || op2Address === undefined) {
        console.error("OOB while accessing addresses, trying to access quartet at index", currentIndex);
    }
  
    const op1 = programCopy[op1Address];
    const op2 = programCopy[op2Address];
  
    if (op1 === undefined || op2 === undefined) {
        console.error("OOB while accessing values, trying to access quartet at index", currentIndex);
    }
  
    // Execute
    let result = 0;
    switch (currentOpcode) {
      case SUM_OPCODE:
        result = op1 + op2;
        break;
      case MULTIPLY_OPCODE:
        result = op1 * op2;
        break
      default: {
        console.error("Unknown opcode", currentOpcode);
      }
        result = 0;
    };
  
    // Write
    const destinationAddress = programCopy[currentIndex + 3];
    programCopy[destinationAddress] = result;
  
    // Step
    currentIndex += STEP_SIZE;
    currentOpcode = programCopy[currentIndex];
  }
  return programCopy;
}

// Main
const expectedResult = 19690720;

let noun = 0;
let verb = 0;
let currentResult = 0

while (currentResult !== expectedResult) {
  noun = (noun + 1) % 100;
  verb = noun === 0 ? verb + 1 : verb;

  const executedProgram = executeProgramWithInputs(mainProgram, noun, verb);
  currentResult = executedProgram[0];
}

console.log("Finished, result:", 100 * noun + verb);