import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatMiniFabButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatDivider } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { EditTableRowDialogComponent, PeriodicTableComponent } from '@components';
import { IPeriodicElement } from '@data-access';
import { PeriodicListStateService } from '@states';
import { debounceTime, distinctUntilChanged, filter, tap } from 'rxjs';

import { inputDebounceTime } from './app.constants';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    MatDivider,
    MatInput,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatIcon,
    MatMiniFabButton,
    PeriodicTableComponent,
  ],
  providers: [PeriodicListStateService],
  templateUrl: `./app.component.html`,
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  readonly #fb = inject(NonNullableFormBuilder);
  readonly #destroyRef = inject(DestroyRef);
  readonly #matDialog = inject(MatDialog);
  readonly #periodicListStateService = inject(PeriodicListStateService);

  dataSource = this.#periodicListStateService.selectPeriodicListAsMatTableDataSource;

  filterFormControl = this.#fb.control<string>('');

  ngOnInit(): void {
    this.#handleFilterFormControl();
  }

  handleTableRowEditBtnClick(data: IPeriodicElement): void {
    this.#matDialog
      .open<
        EditTableRowDialogComponent,
        IPeriodicElement,
        {
          itemToUpdate: IPeriodicElement;
          updatedItem: IPeriodicElement;
        }
      >(EditTableRowDialogComponent, {
        data,
      })
      .afterClosed()
      .pipe(
        filter(resultData => !!resultData),
        tap(({ itemToUpdate, updatedItem }) => {
          this.#periodicListStateService.updateListElement(itemToUpdate, updatedItem);
          this.filterFormControl.reset();
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
        tap(value => (this.dataSource().filter = value.trim().toLowerCase())),
        takeUntilDestroyed(this.#destroyRef)
      )
      .subscribe();
  }
}
