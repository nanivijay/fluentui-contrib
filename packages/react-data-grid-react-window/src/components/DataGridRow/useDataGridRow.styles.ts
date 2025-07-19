import {
  makeStyles,
  mergeClasses,
  useDataGridRowStyles_unstable as useDataGridRowStylesBase_unstable,
  DataGridRowState,
  tokens,
} from '@fluentui/react-components';
import { useDisabledRowContext } from '../../contexts/disabledRowContext';

const useStyles = makeStyles({
  root: {
    minWidth: 'fit-content',
  },
  disabled: {
    opacity: tokens.colorNeutralForegroundDisabled,
    cursor: 'not-allowed',
    pointerEvents: 'none',
    color: tokens.colorNeutralForegroundDisabled,
    '& [role="gridcell"]': {
      color: tokens.colorNeutralForegroundDisabled,
    },
    // Hide selection cell for disabled rows
    '& [role="gridcell"][data-selection-cell="true"]': {
      visibility: 'hidden',
    },
  },
});

/**
 * Apply styling to the DataGridRow slots based on the state
 */
export const useDataGridRowStyles_unstable = (
  state: DataGridRowState
): DataGridRowState => {
  const classes = useStyles();
  const isDisabled = useDisabledRowContext();
  
  state.root.className = mergeClasses(
    classes.root,
    isDisabled && classes.disabled,
    state.root.className
  );

  useDataGridRowStylesBase_unstable(state);
  return state;
};
