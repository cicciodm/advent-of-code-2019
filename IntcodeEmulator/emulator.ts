import {
  NOUN_ADDRESS,
  VERB_ADDRESS,
  opCodeToParameterNumber,
  OpCode,
  OPCODE_SUM,
  OPCODE_MULTIPLY,
  OPCODE_EXIT,
  OPCODE_INPUT,
  OPCODE_OUTPUT,
  ParameterMode,
  Operand,
  OPCODE_JMP_TRUE,
  OPCODE_JMP_FALSE,
  OPCODE_LESS_THAN,
  OPCODE_EQUAL
} from "./config";
import { getOpcode, getParameterModes, getOperandValue } from "./utils";

const readline = require('readline');

const reader = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let programInput;

export function executeProgramWithInputs(
  program: number[],
  noun: number,
  verb: number
): void {
  const programCopy = [...program];

  programCopy[NOUN_ADDRESS] = noun;
  program[VERB_ADDRESS] = verb;

  executeProgram(programCopy);
}

export async function executeProgram(program: number[], input?: number): Promise<void> {
  programInput = input;

  let currentIndex = 0;
  let currentInstruction = program[0];
  let currentOpcode = getOpcode(currentInstruction);

  while (currentOpcode !== OPCODE_EXIT) {
    // Execute
    console.log("Executing instruction", program.slice(currentIndex, currentIndex + opCodeToParameterNumber[currentOpcode] + 1));
    const newIndex = await executeInstruction(currentInstruction, currentIndex, program);

    // Step
    currentIndex = newIndex !== undefined ? newIndex : currentIndex + opCodeToParameterNumber[currentOpcode] + 1;
    currentInstruction = program[currentIndex];
    currentOpcode = getOpcode(currentInstruction);
  }
}

async function executeInstruction(
  instruction: number,
  currentIndex: number,
  program: number[]
): Promise<number | undefined> {
  // Get data from instruction
  const opCode = getOpcode(instruction);
  const parameterModes = getParameterModes(instruction);
  const firstIndex = currentIndex + 1;

  // Get The values to operate on
  const operands = parameterModes.map((mode, index) => {
    return {
      mode: mode as ParameterMode,
      immediate: program[firstIndex + index],
      valueAtAddress: program[program[firstIndex + index]]
    }
  })

  if (operands.some(operand => operand === undefined)) {
    console.error(
      "OOB while accessing addresses, trying to access ops at index",
      currentIndex
    );
  }

  return performOperation(opCode, operands, program);
}

async function performOperation(
  opCode: OpCode, 
  operands: Operand[], 
  program: number[]
): Promise<number | undefined> {
  // Operate
  switch (opCode) {
    case OPCODE_SUM: {
      const op1 = getOperandValue(operands[0]);
      const op2 = getOperandValue(operands[1]);
      const result = op1 + op2;
      const lastOperand = operands.pop()
      program[lastOperand.immediate] = result;
      return undefined;
    }
    case OPCODE_MULTIPLY: {
      const op1 = getOperandValue(operands[0]);
      const op2 = getOperandValue(operands[1]);
      const result = op1 * op2;
      const lastOperand = operands.pop()
      program[lastOperand.immediate] = result;
      return undefined;
    }
    case OPCODE_INPUT: {
      const input = await readAsyncInput();

      const lastOperand = operands.pop()
      program[lastOperand.immediate] = input;
      return undefined;
    }
    case OPCODE_OUTPUT: {
      console.log("Program Output:", getOperandValue(operands[0]));
      return undefined;
    }
    case OPCODE_JMP_TRUE: {
      const toTest = getOperandValue(operands[0]);
      return toTest !== 0 ? getOperandValue(operands[1]) : undefined;
    }
    case OPCODE_JMP_FALSE: {
      const toTest = getOperandValue(operands[0]);
      return toTest === 0 ? getOperandValue(operands[1]) : undefined;
    }
    case OPCODE_LESS_THAN: {
      const op1 = getOperandValue(operands[0]);
      const op2 = getOperandValue(operands[1]);
      const toWrite = op1 < op2 ? 1 : 0;

      const lastOperand = operands.pop()
      program[lastOperand.immediate] = toWrite;
      return undefined;
    }
    case OPCODE_EQUAL: {
      const op1 = getOperandValue(operands[0]);
      const op2 = getOperandValue(operands[1]);
      const toWrite = op1 === op2 ? 1 : 0;
      
      const lastOperand = operands.pop()
      program[lastOperand.immediate] = toWrite;
      return undefined;
    }
    default:
      console.error("ERROR: Unknown opcode", opCode);
  }
}

export function readAsyncInput(): Promise<number> {
  return reader.question("Please input a value:", response => {
    return response;
  });
}
