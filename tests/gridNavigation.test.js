import { describe, expect, it } from 'vitest';
import {
  NAV_DIRECTIONS,
  clampColumn,
  resolveNavigation,
} from '../src/lib/gridNavigation';

function move(rowIndex, colIndex, rowCellCounts, direction) {
  return resolveNavigation({ rowIndex, colIndex, rowCellCounts, direction });
}

describe('clampColumn', () => {
  it('keeps the column inside the row and handles empty rows', () => {
    expect(clampColumn(0, 3)).toBe(0);
    expect(clampColumn(2, 3)).toBe(2);
    expect(clampColumn(5, 3)).toBe(2);
    expect(clampColumn(-1, 3)).toBe(0);
    expect(clampColumn(0, 0)).toBe(-1);
  });
});

describe('horizontal navigation', () => {
  const rows = [3, 2];

  it('moves to the next and previous editable cell in the row', () => {
    expect(move(0, 0, rows, NAV_DIRECTIONS.right)).toEqual({
      rowIndex: 0,
      colIndex: 1,
    });
    expect(move(0, 2, rows, NAV_DIRECTIONS.left)).toEqual({
      rowIndex: 0,
      colIndex: 1,
    });
  });

  it('stops at the row edges instead of wrapping', () => {
    expect(move(0, 2, rows, NAV_DIRECTIONS.right)).toBeNull();
    expect(move(0, 0, rows, NAV_DIRECTIONS.left)).toBeNull();
  });
});

describe('vertical navigation', () => {
  it('keeps the same column when the next row has it', () => {
    expect(move(0, 2, [3, 3], NAV_DIRECTIONS.down)).toEqual({
      rowIndex: 1,
      colIndex: 2,
    });
  });

  it('clamps to the last editable cell when the next row is shorter', () => {
    expect(move(0, 2, [3, 2], NAV_DIRECTIONS.down)).toEqual({
      rowIndex: 1,
      colIndex: 1,
    });
    expect(move(1, 1, [3, 2], NAV_DIRECTIONS.up)).toEqual({
      rowIndex: 0,
      colIndex: 1,
    });
  });

  it('clamps up as well when moving into a shorter row', () => {
    expect(move(1, 2, [2, 3], NAV_DIRECTIONS.up)).toEqual({
      rowIndex: 0,
      colIndex: 1,
    });
  });

  it('skips rows with no editable cells', () => {
    expect(move(0, 1, [3, 0, 3], NAV_DIRECTIONS.down)).toEqual({
      rowIndex: 2,
      colIndex: 1,
    });
    expect(move(2, 1, [3, 0, 3], NAV_DIRECTIONS.up)).toEqual({
      rowIndex: 0,
      colIndex: 1,
    });
  });

  it('stops at the first and last row', () => {
    expect(move(0, 0, [3, 3], NAV_DIRECTIONS.up)).toBeNull();
    expect(move(1, 0, [3, 3], NAV_DIRECTIONS.down)).toBeNull();
  });
});

describe('cross-section traversal', () => {
  const rows = [3, 3, 2, 3, 2];

  it('flows from description rows into description deductions', () => {
    expect(move(1, 2, rows, NAV_DIRECTIONS.down)).toEqual({
      rowIndex: 2,
      colIndex: 1,
    });
  });

  it('flows from description deductions into helper rows', () => {
    expect(move(2, 1, rows, NAV_DIRECTIONS.down)).toEqual({
      rowIndex: 3,
      colIndex: 1,
    });
  });

  it('flows back up from helpers into description deductions', () => {
    expect(move(3, 0, rows, NAV_DIRECTIONS.up)).toEqual({
      rowIndex: 2,
      colIndex: 0,
    });
  });

  it('stops after the final editable cell of the app', () => {
    expect(move(4, 1, rows, NAV_DIRECTIONS.down)).toBeNull();
    expect(move(0, 0, rows, NAV_DIRECTIONS.up)).toBeNull();
  });
});

describe('invalid input', () => {
  it('returns null for unknown directions and empty row lists', () => {
    expect(move(0, 0, [3], 'sideways')).toBeNull();
    expect(move(0, 0, [], NAV_DIRECTIONS.down)).toBeNull();
    expect(move(-1, 0, [3], NAV_DIRECTIONS.down)).toBeNull();
    expect(move(3, 0, [3], NAV_DIRECTIONS.down)).toBeNull();
  });
});
