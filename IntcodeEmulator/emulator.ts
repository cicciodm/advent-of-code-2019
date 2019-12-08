import {
  NOUN_ADDRESS,
  VERB_ADDRESS,
  opCodeToParameterNumber,
  OpCode,
  MODE_POSITION,
  MODE_IMMEDIATE,
  OPCODE_SUM,
  OPCODE_MULTIPLY,
  OPCODE_EXIT,
  OPCODE_INPUT,
  OPCODE_OUTPUT,
  ParameterMode,
  Operand
} from "./config";
import { getOpcode, getParameterModes, getOperandValue } from "./utils";

// const readline = require('readline');

let programInput;

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

export function executeProgram(program: number[], input?: number): number[] {
  programInput = input;

  let currentIndex = 0;
  let currentInstruction = program[0];
  let currentOpcode = getOpcode(currentInstruction);

  while (currentOpcode !== OPCODE_EXIT) {
    // Execute
    console.log("Executing instruction", program.slice(currentIndex, currentIndex + opCodeToParameterNumber[currentOpcode] + 1));
    executeInstruction(currentInstruction, currentIndex, program);

    // Step
    currentIndex += opCodeToParameterNumber[currentOpcode] + 1;
    currentInstruction = program[currentIndex];
    currentOpcode = getOpcode(currentInstruction);
  }
  return program;
}

function executeInstruction(
  instruction: number,
  currentIndex: number,
  program: number[]
): void {
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

  performOperation(opCode, operands, program);
}

function performOperation(opCode: OpCode, operands: Operand[], program: number[]) {
  let result: number;

  // Operate
  switch (opCode) {
    case OPCODE_SUM: {
      const op1 = getOperandValue(operands[0]);
      const op2 = getOperandValue(operands[1]);
      result = op1 + op2;
      // console.log("result of sum", op1, op2, result);
      break;
    }
    case OPCODE_MULTIPLY: {
      const op1 = getOperandValue(operands[0]);
      const op2 = getOperandValue(operands[1]);
      result = op1 * op2;
      break;
    }
    case OPCODE_INPUT: {
      console.log("Please input a value");
      result = programInput;
      break;
    }
    case OPCODE_OUTPUT: {
      console.log("Program Output:", getOperandValue(operands[0]));
      return;
    }
  }

  // Write
  const lastOperand = operands.pop()
  program[lastOperand.immediate] = result;
  // console.log("Storing result", result, "at address", lastOperand.immediate, "program is", program[lastOperand.immediate]);
}
