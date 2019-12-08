export const OPCODE_EXIT = 99;
export const OPCODE_SUM = 1;
export const OPCODE_MULTIPLY = 2;
export const OPCODE_INPUT = 3;
export const OPCODE_OUTPUT = 4;
export const OPCODE_JMP_TRUE = 5;
export const OPCODE_JMP_FALSE = 6;
export const OPCODE_LESS_THAN = 7;
export const OPCODE_EQUAL = 8;

export const NOUN_ADDRESS = 1;
export const VERB_ADDRESS = 2;
export const OUTPUT_ADDRESS = 0;

export const MODE_POSITION = 0;
export const MODE_IMMEDIATE = 1;

export const INSTRUCTION_SIZE = 5;
export const OPCODE_SIZE = 2;

export type OpCode = 99 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
export type ParameterMode = 0 | 1;

export const opCodeToParameterNumber: { [key in OpCode]: number } = {
  99: 0,
  1: 3,
  2: 3,
  3: 1,
  4: 1,
  5: 2,
  6: 2,
  7: 3,
  8: 3
};

export interface Operand {
  mode: ParameterMode,
  immediate: number;
  valueAtAddress: number;
}