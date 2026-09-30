import type { EnigmaModel, ReflectorName, RotorName } from './types.js';

export const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

export const ROTOR_SPECS: Record<RotorName, { wiring: string; notches: string }> = {
  I: { wiring: 'EKMFLGDQVZNTOWYHXUSPAIBRCJ', notches: 'Q' },
  II: { wiring: 'AJDKSIRUXBLHWTMCQGZNPYFVOE', notches: 'E' },
  III: { wiring: 'BDFHJLCPRTXVZNYEIWGAKMUSQO', notches: 'V' },
  IV: { wiring: 'ESOVPZJAYQUIRHXLNFTGKDCMWB', notches: 'J' },
  V: { wiring: 'VZBRGITYUPSDNHLXAWMJQOFECK', notches: 'Z' },
  VI: { wiring: 'JPGVOUMFYQBENHZRDKASXLICTW', notches: 'ZM' },
  VII: { wiring: 'NZJHGRCXMYSWBOUFAIVLPEKQDT', notches: 'ZM' },
  VIII: { wiring: 'FKQHTLXOCBJSPDZRAMEWNIUYGV', notches: 'ZM' },
  Beta: { wiring: 'LEYJVCNIXWPBQMDRTAKZGFUHOS', notches: '' },
  Gamma: { wiring: 'FSOKANUERHMBTIYCWLQPZXVGJD', notches: '' },
};

export const REFLECTOR_WIRINGS: Record<ReflectorName, string> = {
  A: 'EJMZALYXVBWFCRQUONTSPIKHGD',
  B: 'YRUHQSLDPXNGOKMIEBFZCWVJAT',
  C: 'FVPJIAOYEDRZXWGCTKUQSBNMHL',
  'B-thin': 'ENKQAUYWJICOPBLMDXZVFTHRGS',
  'C-thin': 'RDOBJNTKVEHMLFCWZAXGYIPSUQ',
};

export const MOVING_ROTORS: Record<EnigmaModel, readonly RotorName[]> = {
  I: ['I', 'II', 'III', 'IV', 'V'],
  M3: ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'],
  M4: ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'],
};

export const REFLECTORS: Record<EnigmaModel, readonly ReflectorName[]> = {
  I: ['A', 'B', 'C'],
  M3: ['B', 'C'],
  M4: ['B-thin', 'C-thin'],
};
