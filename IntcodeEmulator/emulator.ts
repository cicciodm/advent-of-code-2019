import {
  EXIT_OPCODE,
  NOUN_ADDRESS,
  VERB_ADDRESS,
  opCodeToParameterNumber,
  SUM_OPCODE,
  MULTIPLY_OPCODE,
  OpCode
} from "./config";

const STEP_SIZE = 4;

export function executeProgramWithInputs(
  program: number[],
  noun: number,
  verb: number
): number[] {
  const programCopy = [...program];

  programCopy[NOUN_ADDRESS] = noun;
  program[VERB_ADDRESS] = verb;

  return executeProgram(programCopy);
}

function executeProgram(program: number[]): number[] {
  let currentIndex = 0;
  let currentOpcode = program[0];

  while (currentOpcode !== EXIT_OPCODE) {
    // Execute
    executeCommand(currentOpcode as OpCode, currentIndex, program);

    // Step
    currentIndex += opCodeToParameterNumber[currentOpcode] + 1;
    currentOpcode = program[currentIndex];
  }
  return program;
}

function executeCommand(
  currentOpcode: OpCode,
  currentIndex: number,
  program: number[]
): void {
  const firstIndex = currentIndex + 1;
  let operationAddresses = opCodeToParameterNumber[currentOpcode];
  let offset = 1;

  const addresses = [];

  while (offset < operationAddresses) {
    addresses.push(firstIndex + offset);
    offset++;
  }

  if (addresses.some(addr => !addr)) {
    console.error(
      "OOB while accessing addresses, trying to access ops at index",
      currentIndex
    );
  }

  const op1 = program[op1Address];
  const op2 = program[op2Address];

  if (op1 === undefined || op2 === undefined) {
    console.error(
      "OOB while accessing values, trying to access quartet at index",
      currentIndex
    );
  }

  // Execute
  let result = 0;
  switch (currentOpcode) {
    case SUM_OPCODE:
      result = op1 + op2;
      break;
    case MULTIPLY_OPCODE:
      result = op1 * op2;
      break;
    default:
      {
        console.error("Unknown opcode", currentOpcode);
      }
      result = 0;
  }

  // Write
  const destinationAddress = program[currentIndex + 3];
  program[destinationAddress] = result;
}
