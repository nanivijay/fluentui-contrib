# Disabled Row Support

This package now supports disabled rows in the DataGrid component. Disabled rows provide a way to display data that should be non-interactive and visually distinct.

## Features

- ✅ **Visual Distinction**: Disabled rows are grayed out with reduced opacity
- ✅ **Selection Exclusion**: Disabled rows cannot be selected and are excluded from "select all" operations
- ✅ **Hidden Selection UI**: Selection checkboxes are hidden for disabled rows
- ✅ **Automatic Positioning**: Disabled rows are automatically moved to the end, even when sorting
- ✅ **Accessibility**: Proper `aria-disabled` attributes are applied

## Usage

### Basic Usage

```tsx
import { DataGrid, WithDisabled } from '@fluentui-contrib/react-data-grid-react-window';

// Define your item type with disabled support
type MyItem = WithDisabled<{
  id: number;
  name: string;
  value: string;
}>;

// Create items with some disabled
const items: MyItem[] = [
  { id: 1, name: 'Item 1', value: 'Active', disabled: false },
  { id: 2, name: 'Item 2', value: 'Disabled', disabled: true },
  { id: 3, name: 'Item 3', value: 'Active' }, // disabled is optional
];

// Use in DataGrid as normal
<DataGrid
  items={items}
  columns={columns}
  selectionMode="multiselect"
>
  {/* Your DataGrid content */}
</DataGrid>
```

### Advanced Usage

```tsx
// You can also use the DisabledItem interface directly
import { DisabledItem } from '@fluentui-contrib/react-data-grid-react-window';

interface CustomItem extends DisabledItem {
  id: number;
  name: string;
  status: 'active' | 'inactive' | 'archived';
}

const items: CustomItem[] = [
  { id: 1, name: 'Item 1', status: 'active' },
  { id: 2, name: 'Item 2', status: 'archived', disabled: true },
];
```

## API

### Types

#### `DisabledItem`
```tsx
interface DisabledItem {
  disabled?: boolean;
}
```

#### `WithDisabled<T>`
```tsx
type WithDisabled<T> = T & DisabledItem;
```

A helper type that adds disabled support to any item type.

### Behavior

1. **Sorting**: When columns are sorted, disabled items are automatically moved to the end while preserving the sort order of enabled items.

2. **Selection**: 
   - Disabled rows cannot be individually selected
   - "Select all" operations exclude disabled rows
   - Selection callbacks receive filtered results without disabled items

3. **Visual State**:
   - Disabled rows have reduced opacity
   - Selection checkboxes are hidden
   - Hover and focus states are disabled
   - Proper color tokens for accessibility

4. **Accessibility**:
   - `aria-disabled="true"` is applied to disabled rows
   - Screen readers will announce the disabled state

## Examples

See the `DisabledRows` story in Storybook for a complete working example that demonstrates all features including sorting and selection behavior.