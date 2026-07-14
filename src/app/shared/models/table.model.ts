export type TableCellValue =
  | string
  | number
  | boolean
  | null
  | undefined;

export interface TableColumn<T extends object> {
  key: keyof T;
  header: string;
  headerClass?: string;

  sortable?: boolean;

  formatter?: (
    row: T
  ) => TableCellValue;

  cellClass?: (
    row: T
  ) => string;
}

export interface TableAction<T extends object> {
  id: string;
  label?: string;
  icon: string;

  visible?: (
    row: T
  ) => boolean;

  disabled?: (
    row: T
  ) => boolean;
}

export interface TableActionEvent<T extends object> {
  actionId: string;
  row: T;
}
