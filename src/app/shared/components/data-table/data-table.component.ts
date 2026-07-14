import {
  Component,
  computed,
  effect,
  input,
  output,
  viewChild
} from '@angular/core';

import { NgClass } from '@angular/common';

import {
  MatTableDataSource,
  MatTableModule
} from '@angular/material/table';

import {
  MatPaginator,
  MatPaginatorModule
} from '@angular/material/paginator';

import {
  MatSort,
  MatSortModule
} from '@angular/material/sort';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import {
  TableAction,
  TableActionEvent,
  TableCellValue,
  TableColumn
} from '../../models/table.model';

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [
    NgClass,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './data-table.component.html',
  styleUrl: './data-table.component.css'
})
export class DataTableComponent<
  T extends object
> {
  protected readonly skeletonColumns = Array.from({
    length: 6
  });

  readonly rows = input<T[]>([]);

  readonly columns =
    input<TableColumn<T>[]>([]);

  readonly actions =
    input<TableAction<T>[]>([]);

  readonly loading = input(false);

  readonly emptyMessage =
    input('No records found.');

  readonly pageSize = input(5);

  readonly pageSizeOptions =
    input<number[]>([5, 10, 20]);

  readonly actionClicked =
    output<TableActionEvent<T>>();

  readonly paginator =
    viewChild(MatPaginator);

  readonly sort =
    viewChild(MatSort);

  readonly dataSource =
    new MatTableDataSource<T>();

  readonly displayedColumns = computed(() => {
    const columnKeys = this.columns().map(
      (column) => String(column.key)
    );

    if (this.actions().length > 0) {
      return [...columnKeys, 'actions'];
    }

    return columnKeys;
  });

  readonly skeletonRows = computed(() =>
    Array.from({
      length: this.pageSize()
    })
  );

  constructor() {
    effect(() => {
      this.dataSource.data = this.rows();

      const paginator = this.paginator();
      if (paginator && paginator.pageIndex > 0) {
        paginator.firstPage();
      }
    }, { allowSignalWrites: true });

    effect(() => {
      const paginator = this.paginator();
      const sort = this.sort();

      if (paginator) {
        this.dataSource.paginator = paginator;
      }

      if (sort) {
        this.dataSource.sort = sort;
      }
    }, { allowSignalWrites: true });
  }

  getCellValue(
    row: T,
    column: TableColumn<T>
  ): TableCellValue {
    if (column.formatter) {
      return column.formatter(row);
    }

    const value = row[column.key];

    if (value === null || value === undefined) {
      return '';
    }

    if (
      typeof value === 'string' ||
      typeof value === 'number' ||
      typeof value === 'boolean'
    ) {
      return value;
    }

    return String(value);
  }

  getCellClass(
    row: T,
    column: TableColumn<T>
  ): string {
    return column.cellClass
      ? column.cellClass(row)
      : '';
  }

  isActionVisible(
    action: TableAction<T>,
    row: T
  ): boolean {
    return action.visible
      ? action.visible(row)
      : true;
  }

  isActionDisabled(
    action: TableAction<T>,
    row: T
  ): boolean {
    return action.disabled
      ? action.disabled(row)
      : false;
  }

  emitAction(
    actionId: string,
    row: T
  ): void {
    this.actionClicked.emit({
      actionId,
      row
    });
  }
}
