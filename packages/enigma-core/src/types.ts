export type EnigmaModel = 'I' | 'M3' | 'M4';
export type MovingRotor = 'I' | 'II' | 'III' | 'IV' | 'V' | 'VI' | 'VII' | 'VIII';
export type GreekRotor = 'Beta' | 'Gamma';
export type RotorName = MovingRotor | GreekRotor;
export type ReflectorName = 'A' | 'B' | 'C' | 'B-thin' | 'C-thin';

export interface MachineConfig {
  model: EnigmaModel;
  rotors: RotorName[];
  rings: number[];
  positions: number[];
  reflector: ReflectorName;
  plugs: string[];
}

export interface SignalStage {
  kind: 'plug' | 'rotor' | 'reflector';
  index: number | null;
  label: string;
  input: number;
  output: number;
  direction: 'forward' | 'reflect' | 'return';
}

export interface KeyPressResult {
  input: string;
  output: string;
  before: number[];
  after: number[];
  stepped: boolean[];
  middleNotch: boolean;
  rightNotch: boolean;
  stages: SignalStage[];
}
