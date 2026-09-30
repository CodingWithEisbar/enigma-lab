import { ALPHABET, MOVING_ROTORS, REFLECTORS, REFLECTOR_WIRINGS, ROTOR_SPECS } from './constants.js';
import type {
  EnigmaModel,
  KeyPressResult,
  MachineConfig,
  ReflectorName,
  RotorName,
  SignalStage,
} from './types.js';

export * from './constants.js';
export type * from './types.js';

const mod = (value: number): number => ((value % 26) + 26) % 26;

const rotorMaps = Object.fromEntries(
  Object.entries(ROTOR_SPECS).map(([name, spec]) => {
    const forward = [...spec.wiring].map((letter) => ALPHABET.indexOf(letter));
    const inverse = Array<number>(26);
    forward.forEach((value, index) => {
      inverse[value] = index;
    });
    return [name, { forward, inverse, notches: spec.notches }];
  }),
) as Record<RotorName, { forward: number[]; inverse: number[]; notches: string }>;

export function normalizeMessage(value: string): string {
  return String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'D')
    .toUpperCase()
    .replace(/[^A-Z]/g, '');
}

export function defaultConfig(model: EnigmaModel = 'I'): MachineConfig {
  if (model === 'M4') {
    return {
      model,
      rotors: ['Beta', 'I', 'II', 'III'],
      rings: [0, 0, 0, 0],
      positions: [0, 0, 0, 0],
      reflector: 'B-thin',
      plugs: [],
    };
  }
  return {
    model,
    rotors: ['I', 'II', 'III'],
    rings: [0, 0, 0],
    positions: [0, 0, 0],
    reflector: 'B',
    plugs: [],
  };
}

export function parsePlugboard(value: string | string[]): string[] {
  const parts = (Array.isArray(value) ? value : value.split(/[\s,;]+/))
    .map((pair) => pair.trim().toUpperCase())
    .filter(Boolean);
  if (parts.length > 13) throw new Error('Plugboard có tối đa 13 cặp dây.');
  const seen = new Set<string>();
  for (const pair of parts) {
    if (!/^[A-Z]{2}$/.test(pair)) throw new Error('Mỗi cặp gồm đúng 2 chữ A–Z.');
    if (pair[0] === pair[1]) throw new Error(`Không thể nối ${pair} với chính nó.`);
    for (const letter of pair) {
      if (seen.has(letter)) throw new Error(`Chữ ${letter} đang được dùng ở nhiều cặp dây.`);
      seen.add(letter);
    }
  }
  return parts.map((pair) => [...pair].sort().join('')).sort();
}

export function validateConfig(input: MachineConfig): MachineConfig {
  if (!input || !(['I', 'M3', 'M4'] as const).includes(input.model)) {
    throw new Error('Mẫu máy không hợp lệ.');
  }
  const rotorCount = input.model === 'M4' ? 4 : 3;
  if (input.rotors.length !== rotorCount) throw new Error('Số lượng rotor không đúng với mẫu máy.');
  const moving = input.rotors.slice(-3);
  if (
    moving.some((rotor) => !MOVING_ROTORS[input.model].includes(rotor)) ||
    new Set(moving).size !== 3
  ) {
    throw new Error('Ba rotor chuyển động phải khác nhau và phù hợp mẫu máy.');
  }
  if (input.model === 'M4' && !(['Beta', 'Gamma'] as const).includes(input.rotors[0] as 'Beta')) {
    throw new Error('Rotor ngoài cùng trái của M4 phải là Beta hoặc Gamma.');
  }
  if (!REFLECTORS[input.model].includes(input.reflector)) {
    throw new Error('Reflector không phù hợp với mẫu máy.');
  }
  for (const values of [input.rings, input.positions]) {
    if (
      values.length !== rotorCount ||
      values.some((value) => !Number.isInteger(value) || value < 0 || value > 25)
    ) {
      throw new Error('Vị trí và vòng rotor phải trong khoảng 0–25.');
    }
  }
  return {
    model: input.model,
    rotors: [...input.rotors],
    rings: [...input.rings],
    positions: [...input.positions],
    reflector: input.reflector,
    plugs: parsePlugboard(input.plugs),
  };
}

export function passRotor(
  rotor: RotorName,
  value: number,
  position: number,
  ring: number,
  reverse = false,
): number {
  const offset = position - ring;
  const contact = mod(value + offset);
  const map = reverse ? rotorMaps[rotor].inverse : rotorMaps[rotor].forward;
  return mod(map[contact]! - offset);
}

export class EnigmaMachine {
  readonly config: MachineConfig;
  readonly positions: number[];
  private readonly plugboard: number[];

  constructor(config: MachineConfig) {
    this.config = validateConfig(config);
    this.positions = [...this.config.positions];
    this.plugboard = Array.from({ length: 26 }, (_, index) => index);
    for (const pair of this.config.plugs) {
      const a = ALPHABET.indexOf(pair[0]!);
      const b = ALPHABET.indexOf(pair[1]!);
      this.plugboard[a] = b;
      this.plugboard[b] = a;
    }
  }

  press(letter: string): KeyPressResult {
    if (!/^[A-Z]$/.test(letter)) throw new Error('Máy chỉ nhận một chữ A–Z.');
    const { rotors, rings, reflector } = this.config;
    const rotorCount = rotors.length;
    const before = [...this.positions];
    const left = rotorCount - 3;
    const middle = rotorCount - 2;
    const right = rotorCount - 1;
    const middleNotch = rotorMaps[rotors[middle]!].notches.includes(ALPHABET[this.positions[middle]!]!);
    const rightNotch = rotorMaps[rotors[right]!].notches.includes(ALPHABET[this.positions[right]!]!);
    const stepped = Array<boolean>(rotorCount).fill(false);
    stepped[right] = true;
    if (middleNotch) {
      this.positions[left] = mod(this.positions[left]! + 1);
      stepped[left] = true;
    }
    if (middleNotch || rightNotch) {
      this.positions[middle] = mod(this.positions[middle]! + 1);
      stepped[middle] = true;
    }
    this.positions[right] = mod(this.positions[right]! + 1);

    let signal = ALPHABET.indexOf(letter);
    const stages: SignalStage[] = [];
    const addStage = (
      kind: SignalStage['kind'],
      index: number | null,
      label: string,
      output: number,
      direction: SignalStage['direction'],
    ): void => {
      stages.push({ kind, index, label, input: signal, output, direction });
      signal = output;
    };

    addStage('plug', null, 'Plugboard', this.plugboard[signal]!, 'forward');
    for (let index = rotorCount - 1; index >= 0; index -= 1) {
      addStage(
        'rotor',
        index,
        rotors[index]!,
        passRotor(rotors[index]!, signal, this.positions[index]!, rings[index]!),
        'forward',
      );
    }
    addStage(
      'reflector',
      null,
      reflector,
      ALPHABET.indexOf(REFLECTOR_WIRINGS[reflector][signal]!),
      'reflect',
    );
    for (let index = 0; index < rotorCount; index += 1) {
      addStage(
        'rotor',
        index,
        rotors[index]!,
        passRotor(rotors[index]!, signal, this.positions[index]!, rings[index]!, true),
        'return',
      );
    }
    addStage('plug', null, 'Plugboard', this.plugboard[signal]!, 'return');
    return {
      input: letter,
      output: ALPHABET[signal]!,
      before,
      after: [...this.positions],
      stepped,
      middleNotch,
      rightNotch,
      stages,
    };
  }

  process(message: string): string {
    return [...message].map((letter) => this.press(letter).output).join('');
  }
}

export function positionLetters(values: number[]): string {
  return values.map((value) => ALPHABET[value] ?? '?').join('');
}

export function reflectorForModel(model: EnigmaModel): ReflectorName {
  return model === 'M4' ? 'B-thin' : 'B';
}
