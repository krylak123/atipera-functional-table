import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatMiniFabButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatDivider } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { EditTableRowDialogComponent } from '@components';
import { IPeriodicElement } from '@data-access';
import { debounceTime, distinctUntilChanged, filter, tap } from 'rxjs';

import { inputDebounceTime } from './app.constants';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [MatDivider, MatInput, MatTableModule, MatFormFieldModule, ReactiveFormsModule, MatIcon, MatMiniFabButton],
  templateUrl: `./app.component.html`,
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  readonly #fb = inject(NonNullableFormBuilder);
  readonly #destroyRef = inject(DestroyRef);
  readonly #matDialog = inject(MatDialog);

  filterFormControl = this.#fb.control<string>('');
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol', 'actions'];
  dataSource = new MatTableDataSource<IPeriodicElement>([
    { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
    { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
    { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
    { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
    { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
    { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
    { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
    { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
    { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
    { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
  ]);

  ngOnInit(): void {
    this.#handleFilterFormControl();
  }

  handleTableRowEditBtnClick(data: IPeriodicElement): void {
    this.#matDialog
      .open<EditTableRowDialogComponent, IPeriodicElement, IPeriodicElement>(EditTableRowDialogComponent, {
        data,
      })
      .afterClosed()
      .pipe(
        filter(isUpdated => !!isUpdated),
        tap(updatedData => {
          console.log(updatedData);
        }),
        takeUntilDestroyed(this.#destroyRef)
      )
      .subscribe();
  }

  #handleFilterFormControl(): void {
    this.filterFormControl.valueChanges
      .pipe(
        debounceTime(inputDebounceTime),
        distinctUntilChanged(),
        tap(value => (this.dataSource.filter = value.trim().toLowerCase())),
        takeUntilDestroyed(this.#destroyRef)
      )
      .subscribe();
  }
}
