/**
 * Represents an item that can be disabled in the DataGrid
 */
export interface DisabledItem {
  /**
   * Whether this item should be disabled (non-selectable and positioned at the end)
   */
  disabled?: boolean;
}

/**
 * Helper type to create an item type that supports disabled state
 */
export type WithDisabled<T> = T & DisabledItem;