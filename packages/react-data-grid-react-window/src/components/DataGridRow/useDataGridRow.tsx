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
  
  // Override onClick to prevent selection on disabled rows
  const originalOnClick = props.onClick;
  const onClick = React.useCallback((e: React.MouseEvent<HTMLElement>) => {
    if (isDisabled) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    if (originalOnClick) {
      originalOnClick(e);
    }
  }, [isDisabled, originalOnClick]);

  // Override onKeyDown to prevent keyboard selection on disabled rows
  const originalOnKeyDown = props.onKeyDown;
  const onKeyDown = React.useCallback((e: React.KeyboardEvent<HTMLElement>) => {
    if (isDisabled && (e.key === ' ' || e.key === 'Enter')) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    if (originalOnKeyDown) {
      originalOnKeyDown(e);
    }
  }, [isDisabled, originalOnKeyDown]);
  
  const state = useBaseState({ 
    ...props, 
    onClick,
    onKeyDown,
    'aria-rowindex': rowIndex 
  }, ref);
  
  // Add disabled state to the row for accessibility and styling
  if (isDisabled) {
    // Set aria-disabled for accessibility
    if (state.root) {
      state.root['aria-disabled'] = true;
      // Disable selection by setting aria-selected to false and making it non-selectable
      state.root['aria-selected'] = false;
      // Remove any selection-related attributes to prevent selection
      if (state.root.tabIndex !== undefined) {
        state.root.tabIndex = -1;
      }
    }
  }
  
  return state;
};
