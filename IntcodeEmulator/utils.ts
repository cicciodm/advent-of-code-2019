import {
  OPCODE_SIZE,
  opCodeToParameterNumber,
  OpCode,
  Operand,
  MODE_POSITION,
  MODE_IMMEDIATE
} from "./config";

export function getOpcode(instruction: number): OpCode {
  return instruction % 100 as OpCode;
}

export function getParameterModes(instructionNum: number): number[] {
  const opCode = getOpcode(instructionNum);
  const instruction = instructionNum.toString().split("");

  let firstModeIndex = instruction.length - 1 - OPCODE_SIZE;

  const modes = [];

  while (modes.length < opCodeToParameterNumber[opCode]) {
    modes.push(parseInt(instruction[firstModeIndex]) || 0);
    firstModeIndex--;
  }

  return modes;
}

export function getOperandValue(operand: Operand): number {
  switch (operand.mode) {
    case MODE_POSITION:
      return operand.valueAtAddress;
    case MODE_IMMEDIATE:
      return operand.immediate;
    default:
      break;
  }
}