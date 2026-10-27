import { useEffect, useRef } from 'react';
import {
  NAV_DIRECTIONS,
  focusCell,
  focusRowEdge,
  resolveNavigation,
} from '../lib/gridNavigation';

const ARROW_KEYS = {
  ArrowUp: NAV_DIRECTIONS.up,
  ArrowDown: NAV_DIRECTIONS.down,
  ArrowLeft: NAV_DIRECTIONS.left,
  ArrowRight: NAV_DIRECTIONS.right,
};

function getNavRows() {
  return Array.from(document.querySelectorAll('[data-nav-row]'));
}

function getRowCells(row) {
  return Array.from(row.querySelectorAll('[data-nav]')).filter(
    (cell) => !cell.disabled,
  );
}

function getRowMeta(row) {
  return {
    section: row.dataset.navSection,
    rowType: row.dataset.rowType,
    rowId: row.dataset.rowId,
  };
}

export default function useGridNavigation({ onAddRow, onRemoveRow }) {
  const handlersRef = useRef({ onAddRow, onRemoveRow });

  useEffect(() => {
    handlersRef.current = { onAddRow, onRemoveRow };
  }, [onAddRow, onRemoveRow]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      const target = event.target;

      if (!(target instanceof Element)) return;
      if (!target.matches('input[data-nav], button[data-nav]')) return;
      if (event.isComposing || event.keyCode === 229) return;

      const isNavButton = target.matches('button[data-nav]');
      const row = target.closest('[data-nav-row]');

      if (!row) return;

      const { section, rowType, rowId } = getRowMeta(row);
      const { onAddRow: addRow, onRemoveRow: removeRow } = handlersRef.current;

      if (
        !isNavButton &&
        (rowType === 'main' || rowType === 'deduction') &&
        event.ctrlKey &&
        !event.altKey &&
        !event.metaKey
      ) {
        if (event.key === 'Enter' && addRow) {
          event.preventDefault();
          addRow(section, rowType);
          window.requestAnimationFrame(() => {
            focusRowEdge(document, section, rowType, 'last');
          });
          return;
        }

        if (event.key === 'Delete' && removeRow) {
          event.preventDefault();

          const rows = getNavRows();
          const rowIndex = rows.indexOf(row);

          removeRow(section, rowType, rowId);

          window.requestAnimationFrame(() => {
            const nextRows = getNavRows();
            const nextRow =
              nextRows[Math.min(rowIndex, nextRows.length - 1)] ?? null;

            focusCell(nextRow ? getRowCells(nextRow)[0] : null);
          });
          return;
        }
      }

      if (event.ctrlKey || event.altKey || event.metaKey) return;

      if (isNavButton && event.key === 'Enter') {
        event.preventDefault();

        const addRowType = target.dataset.addRowType;

        target.click();

        if (addRowType) {
          window.requestAnimationFrame(() => {
            focusRowEdge(document, section, addRowType, 'last');
          });
        }

        return;
      }

      let direction = ARROW_KEYS[event.key];

      if (event.key === 'Enter') {
        direction = event.shiftKey ? NAV_DIRECTIONS.up : NAV_DIRECTIONS.down;
      }

      if (!direction) return;

      const rows = getNavRows();
      const rowIndex = rows.indexOf(row);

      if (rowIndex < 0) return;

      const cells = getRowCells(row);
      const colIndex = cells.indexOf(target);

      if (colIndex < 0) return;

      const targetCell = resolveNavigation({
        rowIndex,
        colIndex,
        rowCellCounts: rows.map((navRow) => getRowCells(navRow).length),
        direction,
      });

      if (!targetCell) return;

      event.preventDefault();

      focusCell(
        getRowCells(rows[targetCell.rowIndex])[targetCell.colIndex] ?? null,
      );
    };

    document.addEventListener('keydown', handleKeyDown, true);

    return () => {
      document.removeEventListener('keydown', handleKeyDown, true);
    };
  }, []);
}
