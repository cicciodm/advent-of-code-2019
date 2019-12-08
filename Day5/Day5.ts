import { program, programInput } from "./input";
import { executeProgram } from "../IntcodeEmulator/emulator";
import { getOpcode, getParameterModes } from "../IntcodeEmulator/utils";

executeProgram(program, programInput);

// console.log(getOpcode(1));
// console.log(getParameterModes(1));
