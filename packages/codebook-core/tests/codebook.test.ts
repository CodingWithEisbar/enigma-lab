import { describe, expect, it } from 'vitest';
import {
  blankCodebook,
  createSeededRandom,
  daysInMonth,
  generateMonthlyCodebook,
  toMachineConfig,
  validateDailyKey,
} from '../src/index.js';

describe('Codebook', () => {
  it('handles leap-year February', () => {
    expect(daysInMonth(1944, 2)).toBe(29);
  });

  it('is deterministic for the same seed', () => {
    const input = { year: 1944, month: 12, model: 'I' as const, seed: 'TEST-1944' };
    expect(generateMonthlyCodebook(input).days).toEqual(generateMonthlyCodebook(input).days);
  });

  it('creates values inside the expected domains', () => {
    const book = generateMonthlyCodebook({ year: 1944, month: 2, model: 'M4', seed: 'M4-TEST' });
    expect(Object.keys(book.days)).toHaveLength(29);
    expect(book.days['29']?.rotors).toHaveLength(4);
    expect(book.days['29']?.plugs).toHaveLength(10);
  });

  it('maps Ringstellung 01–26 to engine indexes 0–25', () => {
    const book = blankCodebook();
    book.days['31'] = validateDailyKey(
      {
        rotors: 'II III IV',
        rings: '20 04 05',
        plugs: 'AO BQ CL EH FT GZ IM JV KR PW',
        kenngruppen: 'EYF KVV GOV SML',
      },
      'I',
    );
    expect(toMachineConfig(book, 31, 'AAA').rings).toEqual([19, 3, 4]);
  });

  it('uses an unbiased bounded generator API', () => {
    const random = createSeededRandom('fixed');
    expect(Array.from({ length: 100 }, () => random.int(7)).every((value) => value >= 0 && value < 7)).toBe(true);
  });
});
