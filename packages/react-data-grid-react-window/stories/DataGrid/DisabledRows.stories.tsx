import * as React from 'react';
import {
  FolderRegular,
  EditRegular,
  OpenRegular,
  DocumentRegular,
  PeopleRegular,
  DocumentPdfRegular,
  VideoRegular,
  MoreHorizontalRegular,
} from '@fluentui/react-icons';
import {
  TableColumnDefinition,
  createTableColumn,
  TableCellLayout,
  PresenceBadgeStatus,
  Avatar,
  useScrollbarWidth,
  useFluent,
  TableCellActions,
  Menu,
  MenuTrigger,
  MenuItem,
  MenuList,
  MenuPopover,
  Button,
} from '@fluentui/react-components';
import {
  DataGridBody,
  DataGrid,
  DataGridRow,
  DataGridHeader,
  DataGridCell,
  DataGridHeaderCell,
  RowRenderer,
  WithDisabled,
} from '@fluentui-contrib/react-data-grid-react-window';

type FileCell = {
  label: string;
  icon: JSX.Element;
};

type LastUpdatedCell = {
  label: string;
  timestamp: number;
};

type LastUpdateCell = {
  label: string;
  icon: JSX.Element;
};

type AuthorCell = {
  label: string;
  status: PresenceBadgeStatus;
};

type Item = WithDisabled<{
  index: number;
  file: FileCell;
  author: AuthorCell;
  lastUpdated: LastUpdatedCell;
  lastUpdate: LastUpdateCell;
}>;

const baseItems = [
  {
    file: { label: 'Meeting notes', icon: <DocumentRegular /> },
    author: { label: 'Max Mustermann', status: 'available' },
    lastUpdated: { label: '7h ago', timestamp: 1 },
    lastUpdate: {
      label: 'You edited this',
      icon: <EditRegular />,
    },
  },
  {
    file: { label: 'Thursday presentation', icon: <FolderRegular /> },
    author: { label: 'Erika Mustermann', status: 'busy' },
    lastUpdated: { label: 'Yesterday at 1:45 PM', timestamp: 2 },
    lastUpdate: {
      label: 'You recently opened this',
      icon: <OpenRegular />,
    },
  },
  {
    file: { label: 'Training recording', icon: <VideoRegular /> },
    author: { label: 'John Doe', status: 'away' },
    lastUpdated: { label: 'Yesterday at 1:45 PM', timestamp: 2 },
    lastUpdate: {
      label: 'You recently opened this',
      icon: <OpenRegular />,
    },
  },
  {
    file: { label: 'Purchase order', icon: <DocumentPdfRegular /> },
    author: { label: 'Jane Doe', status: 'offline' },
    lastUpdated: { label: 'Tue at 9:30 AM', timestamp: 3 },
    lastUpdate: {
      label: 'You shared this in a Teams chat',
      icon: <PeopleRegular />,
    },
  },
];

// Create items with some disabled ones
const items: Item[] = new Array(20)
  .fill(0)
  .map((_, i) => ({ 
    ...baseItems[i % baseItems.length], 
    index: i,
    // Make every 4th item disabled to show clear separation
    disabled: i % 4 === 3,
  }));

const columns: TableColumnDefinition<Item>[] = [
  createTableColumn<Item>({
    columnId: 'file',
    compare: (a, b) => {
      return a.file.label.localeCompare(b.file.label);
    },
    renderHeaderCell: () => {
      return 'File';
    },
    renderCell: (item) => {
      return (
        <TableCellLayout media={item.file.icon}>
          <strong>[{item.index}] </strong>
          {item.file.label}
          {item.disabled && ' (Disabled)'}
          <TableCellActions>
            <Menu>
              <MenuTrigger>
                <Button
                  appearance="subtle"
                  aria-label="more"
                  icon={<MoreHorizontalRegular />}
                />
              </MenuTrigger>

              <MenuPopover>
                <MenuList>
                  <MenuItem>Item</MenuItem>
                  <MenuItem>Item</MenuItem>
                  <MenuItem>Item</MenuItem>
                </MenuList>
              </MenuPopover>
            </Menu>
          </TableCellActions>
        </TableCellLayout>
      );
    },
  }),
  createTableColumn<Item>({
    columnId: 'author',
    compare: (a, b) => {
      return a.author.label.localeCompare(b.author.label);
    },
    renderHeaderCell: () => {
      return 'Author';
    },
    renderCell: (item) => {
      return (
        <TableCellLayout
          media={<Avatar badge={{ status: item.author.status }} />}
        >
          {item.author.label}
        </TableCellLayout>
      );
    },
  }),
  createTableColumn<Item>({
    columnId: 'lastUpdated',
    compare: (a, b) => {
      return a.lastUpdated.timestamp - b.lastUpdated.timestamp;
    },
    renderHeaderCell: () => {
      return 'Last updated';
    },

    renderCell: (item) => {
      return item.lastUpdated.label;
    },
  }),
  createTableColumn<Item>({
    columnId: 'lastUpdate',
    compare: (a, b) => {
      return a.lastUpdate.label.localeCompare(b.lastUpdate.label);
    },
    renderHeaderCell: () => {
      return 'Last update';
    },
    renderCell: (item) => {
      return (
        <TableCellLayout media={item.lastUpdate.icon}>
          {item.lastUpdate.label}
        </TableCellLayout>
      );
    },
  }),
];

const renderRow: RowRenderer<Item> = ({ item, rowId }, style) => (
  <DataGridRow<Item> key={rowId} style={style}>
    {({ renderCell }) => (
      <DataGridCell focusMode="group">{renderCell(item)}</DataGridCell>
    )}
  </DataGridRow>
);

export const DisabledRows = () => {
  const { targetDocument } = useFluent();
  const scrollbarWidth = useScrollbarWidth({ targetDocument });

  return (
    <DataGrid
      items={items}
      columns={columns}
      focusMode="cell"
      sortable
      selectionMode="multiselect"
      onSelectionChange={(e, data) => {
        console.log('Selection changed:', data);
      }}
    >
      <DataGridHeader style={{ paddingRight: scrollbarWidth }}>
        <DataGridRow>
          {({ renderHeaderCell }) => (
            <DataGridHeaderCell>{renderHeaderCell()}</DataGridHeaderCell>
          )}
        </DataGridRow>
      </DataGridHeader>
      <DataGridBody<Item> itemSize={50} height={400}>
        {renderRow}
      </DataGridBody>
    </DataGrid>
  );
};

DisabledRows.parameters = {
  docs: {
    description: {
      story: [
        'This example demonstrates disabled row support in the DataGrid.',
        '',
        'Features:',
        '- Disabled rows are visually distinct (grayed out with reduced opacity)',
        '- Selection cells are hidden for disabled rows', 
        '- Disabled rows are excluded from selection operations',
        '- Disabled rows are always positioned at the end when sorted',
        '- Supports aria-disabled for accessibility',
        '',
        'In this example, every 4th item is disabled and will appear at the bottom.',
        'Try sorting by different columns to see that disabled items stay at the end.',
      ].join('\n'),
    },
  },
};