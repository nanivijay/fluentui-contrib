import * as React from 'react';
import {
  useDataGrid_unstable as useBaseState,
  DataGridProps,
} from '@fluentui/react-components';
import { useFluent, useScrollbarWidth } from '@fluentui/react-components';
import { DataGridState } from './DataGrid.types';
import type { DisabledItem } from '../../types';

const TABLE_SELECTION_CELL_WIDTH = 44;

/**
 * Sorts rows to keep disabled items at the end while preserving the current sort order
 * This should be applied after the base sorting logic
 */
const moveDisabledRowsToEnd = <T>(rows: T[] | undefined): T[] => {
  // Handle undefined/null rows gracefully
  if (!rows || !Array.isArray(rows)) {
    return [];
  }
  
  // Assuming rows have an 'item' property that contains the actual data
  const enabledRows = rows.filter((row: any) => !(row.item as DisabledItem)?.disabled);
  const disabledRows = rows.filter((row: any) => (row.item as DisabledItem)?.disabled);
  return [...enabledRows, ...disabledRows];
};

/**
 * Create the state required to render DataGrid.
 *
 * The returned state can be modified with hooks such as useDataGridStyles_unstable,
 * before being passed to renderDataGrid_unstable.
 *
 * @param props - props from this instance of DataGrid
 * @param ref - reference to root HTMLElement of DataGrid
 */
export const useDataGrid_unstable = (
  props: DataGridProps,
  ref: React.Ref<HTMLElement>
): DataGridState => {
  const { targetDocument } = useFluent();
  const scrollbarWidth = useScrollbarWidth({ targetDocument });
  const headerRef = React.useRef<HTMLDivElement | null>(null);
  const bodyRef = React.useRef<HTMLDivElement | null>(null);

  // Override selection change callback to exclude disabled items
  const originalOnSelectionChange = props.onSelectionChange;
  const onSelectionChange = React.useCallback((e: any, data: any) => {
    if (originalOnSelectionChange) {
      // Filter selection to only include enabled items
      const filteredData = {
        ...data,
        selectedItems: data.selectedItems?.filter((item: any) => 
          !(item as DisabledItem).disabled
        ) || [],
      };
      originalOnSelectionChange(e, filteredData);
    }
  }, [originalOnSelectionChange]);

  let containerWidthOffset = props.containerWidthOffset;

  if (containerWidthOffset === undefined) {
    containerWidthOffset = props.selectionMode
      ? -TABLE_SELECTION_CELL_WIDTH
      : 0;
    containerWidthOffset -= scrollbarWidth || 0;
  }

  const baseState = useBaseState(
    { 
      ...props, 
      onSelectionChange,
      'aria-rowcount': props.items.length, 
      containerWidthOffset 
    },
    ref
  );

  // After the base state is created, reorder the rows to move disabled items to the end
  // This preserves any sorting that was applied by the base component
  const rowsWithDisabledAtEnd = React.useMemo(() => {
    // Only process rows if they exist, otherwise return the original rows or empty array
    return baseState.rows ? moveDisabledRowsToEnd(baseState.rows) : [];
  }, [baseState.rows]);

  if (
    props.resizableColumns &&
    props.resizableColumnsOptions?.autoFitColumns === false &&
    baseState.root.style
  ) {
    baseState.root.style.minWidth = 'auto';
  }

  return {
    ...baseState,
    rows: baseState.rows ? rowsWithDisabledAtEnd : baseState.rows,
    headerRef,
    bodyRef,
  };
};
