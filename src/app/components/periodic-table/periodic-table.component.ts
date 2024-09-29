import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatMiniFabButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { IPeriodicElement } from '@data-access';

@Component({
  selector: 'app-periodic-table',
  standalone: true,
  imports: [MatTableModule, MatIcon, MatMiniFabButton],
  templateUrl: './periodic-table.component.html',
  styleUrl: './periodic-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PeriodicTableComponent {
  dataSource = input.required<MatTableDataSource<IPeriodicElement>>();
  filteredInputValue = input<string>('');
  editBtnClick = output<IPeriodicElement>();

  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol', 'actions'];
}
