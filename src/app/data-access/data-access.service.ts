import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { PeriodicElement } from '@data-access';
import { Observable, delay } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataAccessService {
  #http = inject(HttpClient);

  public getPeriodsList(): Observable<PeriodicElement[]> {
    return this.#http.get<PeriodicElement[]>('./mock-data.json').pipe(delay(1000));
  }
}
