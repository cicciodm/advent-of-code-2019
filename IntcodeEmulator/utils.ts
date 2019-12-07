import {
  OPCODE_SIZE,
  INSTRUCTION_SIZE,
  opCodeToParameterNumber
} from "./config";

export function getOpcode(instruction: number): number {
  return instruction % 100;
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
