import { describe, expect, it } from 'vitest';
import { defaultConfig, EnigmaMachine, parsePlugboard, positionLetters } from '../src/index.js';

describe('EnigmaMachine', () => {
  it('matches the classic AAAAA vector', () => {
    expect(new EnigmaMachine(defaultConfig()).process('AAAAA')).toBe('BDZGO');
  });

  it('matches HELLOWORLD from AAA', () => {
    expect(new EnigmaMachine(defaultConfig()).process('HELLOWORLD')).toBe('ILBDAAMTAZ');
  });

  it('is reciprocal with the same initial configuration', () => {
    const config = defaultConfig('M4');
    config.rotors = ['Gamma', 'VIII', 'VI', 'II'];
    config.rings = [4, 16, 25, 8];
    config.positions = [10, 3, 20, 22];
    config.reflector = 'C-thin';
    config.plugs = parsePlugboard('AZ BY CX DW EV FU GT HS IR JQ');
    const plain = 'THEQUICKBROWNFOXJUMPSOVERTHELAZYDOG';
    const cipher = new EnigmaMachine(config).process(plain);
    expect(new EnigmaMachine(config).process(cipher)).toBe(plain);
  });

  it('implements double stepping', () => {
    const config = defaultConfig();
    config.positions = [0, 3, 20];
    const machine = new EnigmaMachine(config);
    expect(positionLetters(machine.press('A').after)).toBe('ADV');
    expect(positionLetters(machine.press('A').after)).toBe('AEW');
    expect(positionLetters(machine.press('A').after)).toBe('BFX');
  });

  it('rejects duplicate plugboard letters', () => {
    expect(() => parsePlugboard('AB AC')).toThrow(/nhiều cặp/);
  });
});
