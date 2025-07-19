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
  
  const state = useBaseState({ ...props, 'aria-rowindex': rowIndex }, ref);
  
  // Add disabled state to the row for accessibility and styling
  if (isDisabled) {
    // Set aria-disabled for accessibility
    if (state.root) {
      state.root['aria-disabled'] = true;
    }
  }
  
  return state;
};
