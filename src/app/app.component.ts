import { Component, OnInit, inject } from '@angular/core';
import { DataAccessService } from '@data-access';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [],
  templateUrl: `./app.component.html`,
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  dataAccessService: DataAccessService = inject(DataAccessService);

  ngOnInit(): void {
    console.log('init');

    this.dataAccessService.getPeriodsList().subscribe(data => console.log(data));
  }
}
