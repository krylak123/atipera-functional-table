import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormField, MatLabel, MatPrefix } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { IPeriodicElement } from '@data-access';

interface IPeriodicFormGroup {
  position: FormControl<number>;
  name: FormControl<string>;
  weight: FormControl<number>;
  symbol: FormControl<string>;
}

@Component({
  selector: 'app-edit-table-row-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButton,
    ReactiveFormsModule,
    MatFormField,
    MatIcon,
    MatInput,
    MatLabel,
    MatPrefix,
    JsonPipe,
  ],
  templateUrl: './edit-table-row-dialog.component.html',
  styleUrl: './edit-table-row-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditTableRowDialogComponent {
  readonly data: IPeriodicElement = inject(MAT_DIALOG_DATA);
  readonly #matDialogRef = inject(MatDialogRef<EditTableRowDialogComponent>);
  readonly #fb = inject(NonNullableFormBuilder);

  periodicFormGroup: FormGroup<IPeriodicFormGroup> = this.#fb.group<IPeriodicFormGroup>({
    position: this.#fb.control(this.data.position, [Validators.required]),
    name: this.#fb.control(this.data.name, [Validators.required]),
    weight: this.#fb.control(this.data.weight, [Validators.required]),
    symbol: this.#fb.control(this.data.symbol, [Validators.required]),
  });
  initialPeriodicFormGroupData: unknown = { ...this.periodicFormGroup.value };

  get checkSameValues(): boolean {
    return JSON.stringify(this.initialPeriodicFormGroupData) === JSON.stringify(this.periodicFormGroup.value);
  }

  handleFormSubmit(): void {
    this.#matDialogRef.close(this.periodicFormGroup.value);
  }
}
