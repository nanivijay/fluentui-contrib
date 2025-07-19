import * as React from 'react';
import type {
  DataGridRowProps,
  DataGridRowState,
} from '@fluentui/react-components';
import { useDataGridRow_unstable as useBaseState } from '@fluentui/react-components';
import { useTableRowIndexContext } from '../../contexts/rowIndexContext';
import { useDisabledRowContext } from '../../contexts/disabledRowContext';

/**
 * Create the state required to render DataGridRow.
 *
 * The returned state can be modified with hooks such as useDataGridRowStyles_unstable,
 * before being passed to renderDataGridRow_unstable.
 *
 * @param props - props from this instance of DataGridRow
 * @param ref - reference to root HTMLElement of DataGridRow
 */
export const useDataGridRow_unstable = (
  props: DataGridRowProps,
  ref: React.Ref<HTMLElement>
): DataGridRowState => {
  const rowIndex = useTableRowIndexContext();
  const isDisabled = useDisabledRowContext();
  
  // For disabled rows, we want to prevent selection
  const modifiedProps = isDisabled
    ? { 
        ...props, 
        'aria-rowindex': rowIndex,
        'aria-disabled': true,
        // Override selection behavior for disabled rows
        onClick: undefined,
        onSelectionChange: undefined,
      }
    : { ...props, 'aria-rowindex': rowIndex };
  
  const state = useBaseState(modifiedProps, ref);
  
  // Add disabled state to the row state for styling
  return {
    ...state,
    // Adding disabled as a custom property that can be used in styling
    ...(isDisabled && { 'data-disabled': true }),
  } as DataGridRowState & { 'data-disabled'?: boolean };
};
