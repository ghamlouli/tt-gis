import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { EntityRecord } from '../models/entity.model';

@Injectable({ providedIn: 'root' })
export class EntityCrudService {
  hasBackendResource(table: string): boolean {
    return false;
  }

  getAll(table: string): Observable<EntityRecord[]> {
    return of([]);
  }
}
