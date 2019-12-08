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
  Operand,
  OPCODE_JMP_TRUE,
  OPCODE_JMP_FALSE,
  OPCODE_LESS_THAN,
  OPCODE_EQUAL
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
    const newIndex = executeInstruction(currentInstruction, currentIndex, program);
    
    // Step
    currentIndex = newIndex !== undefined ? newIndex : currentIndex + opCodeToParameterNumber[currentOpcode] + 1;
    currentInstruction = program[currentIndex];
    currentOpcode = getOpcode(currentInstruction);
  }
  return program;
}

function executeInstruction(
  instruction: number,
  currentIndex: number,
  program: number[]
): number | undefined {
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

function performOperation(
  opCode: OpCode, 
  operands: Operand[], 
  program: number[]
): number | undefined {
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
      console.log("Please input a value");
      const result = programInput;
      const lastOperand = operands.pop()
      program[lastOperand.immediate] = result;
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

  
  // Write
  // console.log("Storing result", result, "at address", lastOperand.immediate, "program is", program[lastOperand.immediate]);
}
