import type { EnigmaModel, ReflectorName, RotorName } from '@enigma/core';

export interface DailyKey {
  rotors: RotorName[];
  rings: number[];
  plugs: string[];
  kenngruppen: string[];
}

export interface Codebook {
  schema: 'enigma-codebook';
  version: 1;
  name: string;
  network: string;
  seed: string;
  year: number;
  month: number;
  model: EnigmaModel;
  reflector: ReflectorName;
  days: Record<string, DailyKey>;
}

export interface CodebookMetadata {
  name?: string;
  network?: string;
  seed?: string;
  year?: number;
  month?: number;
  model?: EnigmaModel;
  reflector?: ReflectorName;
}

export interface SeededRandom {
  readonly seed: string;
  uint32(): number;
  int(max: number): number;
  shuffle<T>(values: readonly T[]): T[];
}
