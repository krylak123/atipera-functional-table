import { Injectable, Signal, computed, inject } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { DataAccessService, IPeriodicElement } from '@data-access';
import { rxState } from '@rx-angular/state';

@Injectable()
export class PeriodicListStateService {
  readonly #dataAccessService = inject(DataAccessService);

  #state = rxState<{ periodicList: IPeriodicElement[] }>(({ set, connect }) => {
    set({ periodicList: [] });
    connect('periodicList', this.#dataAccessService.getPeriodsList());
  });

  get selectPeriodicList(): Signal<IPeriodicElement[]> {
    return this.#state.signal('periodicList');
  }

  get selectPeriodicListAsMatTableDataSource(): Signal<MatTableDataSource<IPeriodicElement>> {
    return computed(() => new MatTableDataSource<IPeriodicElement>(this.selectPeriodicList()));
  }

  updateListElement(itemToUpdate: IPeriodicElement, updatedItem: IPeriodicElement): void {
    this.#state.set(({ periodicList }) => ({
      periodicList: periodicList.map(item => {
        if (item.position !== itemToUpdate.position) return item;

        return { ...item, ...updatedItem };
      }),
    }));
  }
}
