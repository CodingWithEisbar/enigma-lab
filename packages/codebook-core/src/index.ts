import {
  ALPHABET,
  MOVING_ROTORS,
  REFLECTORS,
  type EnigmaModel,
  type MachineConfig,
  type ReflectorName,
  type RotorName,
} from '@enigma/core';
import type { Codebook, CodebookMetadata, DailyKey, SeededRandom } from './types.js';

export type * from './types.js';

export const CODEBOOK_SCHEMA = 'enigma-codebook' as const;
export const CODEBOOK_VERSION = 1 as const;
let seedCounter = 0;

export function daysInMonth(year: number, month: number): number {
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

function cleanText(value: unknown, max: number): string {
  return String(value ?? '')
    .trim()
    // Imported metadata must not contain ASCII control characters.
    // eslint-disable-next-line no-control-regex
    .replace(/[\u0000-\u001f\u007f]/g, '')
    .slice(0, max);
}

function normalizeModel(value: unknown): EnigmaModel {
  if (value === 'I' || value === 'M3' || value === 'M4') return value;
  throw new Error('Mẫu máy phải là I, M3 hoặc M4.');
}

function normalizeReflector(model: EnigmaModel, value: unknown): ReflectorName {
  const reflector = String(value ?? REFLECTORS[model][0]) as ReflectorName;
  if (!REFLECTORS[model].includes(reflector)) throw new Error('Reflector không phù hợp mẫu máy.');
  return reflector;
}

function tokens(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(String);
  return String(value ?? '')
    .trim()
    .split(/[\s,;|/]+/)
    .filter(Boolean);
}

function normalizeRotor(value: string): RotorName {
  const upper = value.trim().toUpperCase();
  if (upper === 'BETA') return 'Beta';
  if (upper === 'GAMMA') return 'Gamma';
  return upper as RotorName;
}

function normalizePlugboard(value: unknown): string[] {
  const pairs = tokens(value).map((pair) => pair.toUpperCase());
  if (pairs.length > 13) throw new Error('Plugboard có tối đa 13 cặp.');
  const seen = new Set<string>();
  for (const pair of pairs) {
    if (!/^[A-Z]{2}$/.test(pair) || pair[0] === pair[1]) {
      throw new Error('Mỗi dây phải là hai chữ khác nhau, ví dụ AO.');
    }
    for (const letter of pair) {
      if (seen.has(letter)) throw new Error(`Chữ ${letter} bị dùng trong nhiều dây.`);
      seen.add(letter);
    }
  }
  return pairs.map((pair) => [...pair].sort().join('')).sort();
}

export function newSeed(label = 'codebook'): string {
  seedCounter = (seedCounter + 1) >>> 0;
  const prefix = label.replace(/[^a-zA-Z0-9_-]+/g, '-').slice(0, 28) || 'codebook';
  return `${prefix}-${Date.now().toString(36)}-${seedCounter.toString(36)}`;
}

function hashSeed(value: string): number {
  let hash = 2166136261 >>> 0;
  for (const character of value) {
    hash ^= character.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  hash ^= hash >>> 16;
  hash = Math.imul(hash, 2246822507);
  hash ^= hash >>> 13;
  hash = Math.imul(hash, 3266489909);
  hash ^= hash >>> 16;
  return (hash >>> 0) || 0x6d2b79f5;
}

export function createSeededRandom(seed: string): SeededRandom {
  let state = hashSeed(String(seed));
  const uint32 = (): number => {
    state = (state + 0x6d2b79f5) >>> 0;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return (value ^ (value >>> 14)) >>> 0;
  };
  const int = (max: number): number => {
    if (!Number.isInteger(max) || max < 1) throw new Error('Giới hạn số ngẫu nhiên không hợp lệ.');
    const limit = Math.floor(0x100000000 / max) * max;
    let value: number;
    do value = uint32();
    while (value >= limit);
    return value % max;
  };
  const shuffle = <T>(values: readonly T[]): T[] => {
    const output = [...values];
    for (let index = output.length - 1; index > 0; index -= 1) {
      const other = int(index + 1);
      [output[index], output[other]] = [output[other]!, output[index]!];
    }
    return output;
  };
  return { seed: String(seed), uint32, int, shuffle };
}

export function validateDailyKey(value: unknown, model: EnigmaModel): DailyKey {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('Khóa ngày chưa có dữ liệu.');
  const raw = value as Record<string, unknown>;
  const rotorCount = model === 'M4' ? 4 : 3;
  const rotors = tokens(raw.rotors).map(normalizeRotor);
  const moving = rotors.slice(-3);
  if (rotors.length !== rotorCount) throw new Error(`Walzenlage phải có ${rotorCount} rotor.`);
  if (model === 'M4' && rotors[0] !== 'Beta' && rotors[0] !== 'Gamma') {
    throw new Error('M4 phải bắt đầu bằng Beta hoặc Gamma.');
  }
  if (
    moving.some((rotor) => !MOVING_ROTORS[model].includes(rotor)) ||
    new Set(moving).size !== 3
  ) {
    throw new Error('Ba rotor chuyển động phải khác nhau và phù hợp mẫu máy.');
  }
  const rings = tokens(raw.rings).map(Number);
  if (
    rings.length !== rotorCount ||
    rings.some((ring) => !Number.isInteger(ring) || ring < 1 || ring > 26)
  ) {
    throw new Error(`Ringstellung cần ${rotorCount} số từ 01 đến 26.`);
  }
  const kenngruppen = tokens(raw.kenngruppen).map((group) => group.toUpperCase());
  if (
    kenngruppen.length !== 4 ||
    kenngruppen.some((group) => !/^[A-Z]{3}$/.test(group)) ||
    new Set(kenngruppen).size !== 4
  ) {
    throw new Error('Kenngruppen cần 4 nhóm khác nhau, mỗi nhóm 3 chữ A–Z.');
  }
  return { rotors, rings, plugs: normalizePlugboard(raw.plugs), kenngruppen };
}

export function blankCodebook(metadata: CodebookMetadata = {}): Codebook {
  const year = Number(metadata.year ?? 1944);
  const month = Number(metadata.month ?? 12);
  const model = normalizeModel(metadata.model ?? 'I');
  if (!Number.isInteger(year) || year < 1900 || year > 2100) {
    throw new Error('Năm phải trong khoảng 1900–2100.');
  }
  if (!Number.isInteger(month) || month < 1 || month > 12) throw new Error('Tháng phải từ 1 đến 12.');
  return {
    schema: CODEBOOK_SCHEMA,
    version: CODEBOOK_VERSION,
    name: cleanText(metadata.name ?? 'CODEBOOK', 80) || 'CODEBOOK',
    network: cleanText(metadata.network, 40),
    seed: cleanText(metadata.seed, 80),
    year,
    month,
    model,
    reflector: normalizeReflector(model, metadata.reflector),
    days: {},
  };
}

export function validateCodebook(value: unknown): Codebook {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('Codebook không hợp lệ.');
  const raw = value as Partial<Codebook>;
  if (raw.schema !== CODEBOOK_SCHEMA || raw.version !== CODEBOOK_VERSION) {
    throw new Error('File không đúng định dạng Enigma Codebook v1.');
  }
  const book = blankCodebook(raw);
  if (!raw.days || typeof raw.days !== 'object' || Array.isArray(raw.days)) {
    throw new Error('Danh sách khóa ngày không hợp lệ.');
  }
  const maximum = daysInMonth(book.year, book.month);
  for (const [key, entry] of Object.entries(raw.days)) {
    const day = Number(key);
    if (!Number.isInteger(day) || day < 1 || day > maximum) {
      throw new Error(`Ngày ${key} không thuộc tháng đã chọn.`);
    }
    if (entry !== null && entry !== undefined) book.days[String(day)] = validateDailyKey(entry, book.model);
  }
  return book;
}

function allRotorOrders(model: EnigmaModel): RotorName[][] {
  const output: RotorName[][] = [];
  const moving = MOVING_ROTORS[model];
  const greeks: Array<RotorName | null> = model === 'M4' ? ['Beta', 'Gamma'] : [null];
  for (const greek of greeks) {
    for (const left of moving) {
      for (const middle of moving) {
        for (const right of moving) {
          if (left !== middle && left !== right && middle !== right) {
            output.push(greek ? [greek, left, middle, right] : [left, middle, right]);
          }
        }
      }
    }
  }
  return output;
}

function randomLetters(length: number, random: SeededRandom): string {
  return Array.from({ length }, () => ALPHABET[random.int(26)]!).join('');
}

export function generateDailyKey(
  model: EnigmaModel,
  random: SeededRandom,
  previousRotors: readonly RotorName[] = [],
  usedOrders = new Set<string>(),
): DailyKey {
  const orders = allRotorOrders(model);
  const unused = orders.filter((order) => !usedOrders.has(order.join(' ')));
  const strict = unused.filter(
    (order) =>
      previousRotors.length !== order.length ||
      order.every((rotor, index) => rotor !== previousRotors[index]),
  );
  const pool = strict.length > 0 ? strict : unused.length > 0 ? unused : orders;
  const rotors = pool[random.int(pool.length)]!;
  const letters = random.shuffle([...ALPHABET]).slice(0, 20);
  const plugs: string[] = [];
  for (let index = 0; index < 20; index += 2) {
    plugs.push([letters[index]!, letters[index + 1]!].sort().join(''));
  }
  const groups = new Set<string>();
  while (groups.size < 4) groups.add(randomLetters(3, random));
  return {
    rotors: [...rotors],
    rings: Array.from({ length: rotors.length }, () => random.int(26) + 1),
    plugs: plugs.sort(),
    kenngruppen: [...groups],
  };
}

export function generateMonthlyCodebook(metadata: CodebookMetadata = {}): Codebook {
  const book = blankCodebook(metadata);
  if (!book.seed) book.seed = newSeed(`${book.year}-${book.month}-${book.model}`);
  const random = createSeededRandom(book.seed);
  const usedOrders = new Set<string>();
  let previous: RotorName[] = [];
  for (let day = daysInMonth(book.year, book.month); day >= 1; day -= 1) {
    const entry = generateDailyKey(book.model, random, previous, usedOrders);
    book.days[String(day)] = entry;
    usedOrders.add(entry.rotors.join(' '));
    previous = entry.rotors;
  }
  return book;
}

export function randomStartPosition(model: EnigmaModel, seed = newSeed(`${model}-position`)): string {
  return randomLetters(model === 'M4' ? 4 : 3, createSeededRandom(seed));
}

export function toMachineConfig(bookValue: unknown, day: number, start: string): MachineConfig {
  const book = validateCodebook(bookValue);
  const entry = book.days[String(day)];
  if (!entry) throw new Error('Ngày đã chọn chưa có khóa.');
  const position = start.trim().toUpperCase();
  const expected = book.model === 'M4' ? 4 : 3;
  if (!new RegExp(`^[A-Z]{${expected}}$`).test(position)) {
    throw new Error(`Cửa sổ khởi đầu phải gồm ${expected} chữ A–Z.`);
  }
  return {
    model: book.model,
    rotors: [...entry.rotors],
    rings: entry.rings.map((ring) => ring - 1),
    positions: [...position].map((letter) => ALPHABET.indexOf(letter)),
    reflector: book.reflector,
    plugs: [...entry.plugs],
  };
}
