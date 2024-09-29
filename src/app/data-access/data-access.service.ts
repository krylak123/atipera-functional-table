import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { IPeriodicElement } from '@data-access';
import { Observable, delay } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataAccessService {
  #http = inject(HttpClient);

  public getPeriodsList(): Observable<IPeriodicElement[]> {
    return this.#http.get<IPeriodicElement[]>('./mock-data.json').pipe(delay(1000));
  }
}
