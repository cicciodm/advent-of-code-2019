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

const readline = require("readline");
const noop = {
  output: undefined,
  jumpIndex: undefined
};

const reader = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

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

interface InstructionOutput {
  output: number | undefined;
  jumpIndex: number | undefined;
}

export async function executeProgram(
  program: number[],
  programInputs?: number[]
): Promise<number[]> {
  let currentIndex = 0;
  let currentInstruction = program[0];
  let currentOpcode = getOpcode(currentInstruction);

  const programOutputs = [];

  while (currentOpcode !== OPCODE_EXIT) {
    // Execute
    console.log(
      "Executing instruction",
      program.slice(
        currentIndex,
        currentIndex + opCodeToParameterNumber[currentOpcode] + 1
      )
    );

    const instructionOutputs = await executeInstruction(
      currentInstruction,
      currentIndex,
      program,
      programInputs
    );

    if (instructionOutputs.output !== undefined) {
      programOutputs.push(instructionOutputs.output);
    }

    // Step
    currentIndex =
      instructionOutputs.jumpIndex !== undefined
        ? instructionOutputs.jumpIndex
        : currentIndex + opCodeToParameterNumber[currentOpcode] + 1;
    currentInstruction = program[currentIndex];
    currentOpcode = getOpcode(currentInstruction);
  }

  return programOutputs;
}

async function executeInstruction(
  instruction: number,
  currentIndex: number,
  program: number[],
  programInputs?: number[]
): Promise<InstructionOutput> {
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
    };
  });

  if (operands.some(operand => operand === undefined)) {
    console.error(
      "OOB while accessing addresses, trying to access ops at index",
      currentIndex
    );
  }

  return performOperation(opCode, operands, program, programInputs);
}

async function performOperation(
  opCode: OpCode,
  operands: Operand[],
  program: number[],
  programInputs?: number[]
): Promise<InstructionOutput> {
  // Operate
  switch (opCode) {
    case OPCODE_SUM: {
      const op1 = getOperandValue(operands[0]);
      const op2 = getOperandValue(operands[1]);
      const result = op1 + op2;
      const lastOperand = operands.pop();
      program[lastOperand.immediate] = result;
      return noop;
    }
    case OPCODE_MULTIPLY: {
      const op1 = getOperandValue(operands[0]);
      const op2 = getOperandValue(operands[1]);
      const result = op1 * op2;
      const lastOperand = operands.pop();
      program[lastOperand.immediate] = result;
      return noop;
    }
    case OPCODE_INPUT: {
      let input = programInputs.shift();

      if (input === undefined) {
        console.log("Please input a value:");
        input = await readAsyncInput();
      }

      const lastOperand = operands.pop();
      program[lastOperand.immediate] = input;
      return noop;
    }
    case OPCODE_OUTPUT: {
      const operandValue = getOperandValue(operands[0]);
      console.log("Program Output:", operandValue);
      return {
        jumpIndex: undefined,
        output: operandValue
      };
    }
    case OPCODE_JMP_TRUE: {
      const toTest = getOperandValue(operands[0]);
      return toTest !== 0
        ? { jumpIndex: getOperandValue(operands[1]), output: undefined }
        : noop;
    }
    case OPCODE_JMP_FALSE: {
      const toTest = getOperandValue(operands[0]);
      return toTest === 0
        ? { jumpIndex: getOperandValue(operands[1]), output: undefined }
        : noop;
    }
    case OPCODE_LESS_THAN: {
      const op1 = getOperandValue(operands[0]);
      const op2 = getOperandValue(operands[1]);
      const toWrite = op1 < op2 ? 1 : 0;

      const lastOperand = operands.pop();
      program[lastOperand.immediate] = toWrite;
      return undefined;
    }
    case OPCODE_EQUAL: {
      const op1 = getOperandValue(operands[0]);
      const op2 = getOperandValue(operands[1]);
      const toWrite = op1 === op2 ? 1 : 0;

      const lastOperand = operands.pop();
      program[lastOperand.immediate] = toWrite;
      return undefined;
    }
    default:
      console.error("ERROR: Unknown opcode", opCode);
  }
}

async function readAsyncInput(): Promise<number> {
  for await (const line of reader) {
    reader.close();
    return parseInt(line);
  }
}
