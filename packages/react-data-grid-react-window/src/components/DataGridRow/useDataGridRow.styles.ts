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
    opacity: '0.6',
    cursor: 'not-allowed',
    color: tokens.colorNeutralForegroundDisabled,
    backgroundColor: tokens.colorNeutralBackground2,
    
    // Style all cells in disabled rows
    '& [role="gridcell"]': {
      color: tokens.colorNeutralForegroundDisabled,
    },
    
    // Hide the selection cell for disabled rows
    // This targets the checkbox/selection cell specifically
    '& [role="gridcell"]:first-child': {
      '& input[type="checkbox"]': {
        visibility: 'hidden',
      },
      '& [data-testid="checkbox"]': {
        visibility: 'hidden',
      },
    },
    
    // Disable hover and focus states for disabled rows
    '&:hover': {
      backgroundColor: tokens.colorNeutralBackground2,
    },
    
    '&:focus': {
      outline: 'none',
    },
    
    '&[aria-selected="true"]': {
      backgroundColor: tokens.colorNeutralBackground2,
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
