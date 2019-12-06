export const EXIT_OPCODE = 99;
export const SUM_OPCODE = 1;
export const MULTIPLY_OPCODE = 2;
export const STORE_OPCODE = 3;
export const OUTPUT_OPCODE = 4;

export const NOUN_ADDRESS = 1;
export const VERB_ADDRESS = 2;
export const OUTPUT_ADDRESS = 0;

export const MODE_POSITION = 0;
export const MODE_PARAMETER = 1;

export type OpCode = 99 | 1 | 2 | 3 | 4;

export const opCodeToParameterNumber: { [key in OpCode]: number } = {
  99: 0,
  1: 3,
  2: 3,
  3: 1,
  4: 1
};
