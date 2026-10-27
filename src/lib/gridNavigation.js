export const NAV_DIRECTIONS = {
  up: 'up',
  down: 'down',
  left: 'left',
  right: 'right',
};

export function clampColumn(colIndex, cellCount) {
  if (!Number.isInteger(cellCount) || cellCount <= 0) return -1;

  return Math.min(Math.max(colIndex, 0), cellCount - 1);
}

export function resolveNavigation({
  rowIndex,
  colIndex,
  rowCellCounts,
  direction,
}) {
  if (!Array.isArray(rowCellCounts) || rowCellCounts.length === 0) return null;
  if (rowIndex < 0 || rowIndex >= rowCellCounts.length) return null;

  if (direction === NAV_DIRECTIONS.left || direction === NAV_DIRECTIONS.right) {
    const delta = direction === NAV_DIRECTIONS.right ? 1 : -1;
    const nextCol = colIndex + delta;
    const cellCount = rowCellCounts[rowIndex];

    if (nextCol < 0 || nextCol >= cellCount) return null;

    return { rowIndex, colIndex: nextCol };
  }

  if (direction !== NAV_DIRECTIONS.up && direction !== NAV_DIRECTIONS.down) {
    return null;
  }

  const delta = direction === NAV_DIRECTIONS.down ? 1 : -1;

  for (
    let nextRow = rowIndex + delta;
    nextRow >= 0 && nextRow < rowCellCounts.length;
    nextRow += delta
  ) {
    const cellCount = rowCellCounts[nextRow];

    if (cellCount > 0) {
      return { rowIndex: nextRow, colIndex: clampColumn(colIndex, cellCount) };
    }
  }

  return null;
}

export function focusCell(input) {
  if (!input) return;

  input.focus();
  input.scrollIntoView({ block: 'nearest', inline: 'nearest' });
}

export function focusRowEdge(root, section, rowType, edge = 'last') {
  const rows = Array.from(
    root.querySelectorAll(
      `tr[data-nav-section="${section}"][data-row-type="${rowType}"]`,
    ),
  );
  const row = edge === 'first' ? rows[0] : rows[rows.length - 1];

  focusCell(row?.querySelector('input[data-nav]'));
}
