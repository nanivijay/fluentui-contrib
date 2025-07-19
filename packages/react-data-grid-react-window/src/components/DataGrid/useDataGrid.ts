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
 * Sorts items to keep disabled items at the end while preserving original order
 */
const sortItemsWithDisabledAtEnd = <T extends DisabledItem>(items: T[]): T[] => {
  return React.useMemo(() => {
    const enabledItems = items.filter(item => !item.disabled);
    const disabledItems = items.filter(item => item.disabled);
    return [...enabledItems, ...disabledItems];
  }, [items]);
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

  // Sort items to keep disabled ones at the end
  const sortedItems = sortItemsWithDisabledAtEnd(props.items as (typeof props.items[0] & DisabledItem)[]);

  // Filter out disabled items for selection operations
  const enabledItems = React.useMemo(() => 
    sortedItems.filter(item => !(item as DisabledItem).disabled), 
    [sortedItems]
  );

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
      items: sortedItems, 
      onSelectionChange,
      'aria-rowcount': sortedItems.length, 
      containerWidthOffset 
    },
    ref
  );

  if (
    props.resizableColumns &&
    props.resizableColumnsOptions?.autoFitColumns === false &&
    baseState.root.style
  ) {
    baseState.root.style.minWidth = 'auto';
  }

  return {
    ...baseState,
    headerRef,
    bodyRef,
  };
};
