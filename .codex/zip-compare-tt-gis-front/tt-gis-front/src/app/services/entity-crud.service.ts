import { Injectable } from '@angular/core';

import { EntityRecord, EntityTableKey } from '../models/entity.model';
import { createEmptyRecord } from '../models/field-config';
import { schemaFields } from '../models/schema-fields';

const STORAGE_PREFIX = 'tt-gis-entity-';

export type SortDirection = 'asc' | 'desc';

export type EntityQueryOptions = {
  query?: string;
  searchField?: string;
  sortField?: string;
  sortDirection?: SortDirection;
};

@Injectable({
  providedIn: 'root'
})
export class EntityCrudService {
  getAll(table: EntityTableKey): EntityRecord[] {
    return this.readRecords(table);
  }

  getById(table: EntityTableKey, id: number): EntityRecord | null {
    return this.readRecords(table).find(record => record.id === id) ?? null;
  }

  query(table: EntityTableKey, options: EntityQueryOptions = {}): EntityRecord[] {
    let records = this.filterRecords(table, options.query ?? '', options.searchField);
    return this.sortRecords(records, options.sortField, options.sortDirection ?? 'asc');
  }

  search(table: EntityTableKey, query: string): EntityRecord[] {
    return this.query(table, { query });
  }

  create(table: EntityTableKey, data: Record<string, string | number | null>): EntityRecord {
    const records = this.readRecords(table);
    const record: EntityRecord = {
      id: this.createId(records),
      ...this.sanitizePayload(table, data)
    };

    records.push(record);
    this.writeRecords(table, records);

    return record;
  }

  update(
    table: EntityTableKey,
    id: number,
    data: Record<string, string | number | null>
  ): EntityRecord | null {
    const records = this.readRecords(table);
    const index = records.findIndex(record => record.id === id);

    if (index === -1) {
      return null;
    }

    const updatedRecord: EntityRecord = {
      ...records[index],
      ...this.sanitizePayload(table, data),
      id
    };

    records[index] = updatedRecord;
    this.writeRecords(table, records);

    return updatedRecord;
  }

  delete(table: EntityTableKey, id: number): boolean {
    const records = this.readRecords(table);
    const nextRecords = records.filter(record => record.id !== id);

    if (nextRecords.length === records.length) {
      return false;
    }

    this.writeRecords(table, nextRecords);
    return true;
  }

  count(table: EntityTableKey): number {
    return this.readRecords(table).length;
  }

  countByFieldValue(table: EntityTableKey, field: string, value: string): number {
    return this.getAll(table).filter(record => String(record[field] ?? '') === value).length;
  }

  sumNumericField(table: EntityTableKey, field: string): number {
    return this.getAll(table).reduce((total, record) => total + this.toNumber(record[field]), 0);
  }

  averageNumericField(table: EntityTableKey, field: string): number {
    const records = this.getAll(table).filter(record => record[field] !== null && record[field] !== '');

    if (!records.length) {
      return 0;
    }

    const total = records.reduce((sum, record) => sum + this.toNumber(record[field]), 0);
    return total / records.length;
  }

  groupByField(table: EntityTableKey, field: string): Record<string, number> {
    return this.getAll(table).reduce<Record<string, number>>((groups, record) => {
      const key = String(record[field] ?? 'Non renseigné');
      groups[key] = (groups[key] ?? 0) + 1;
      return groups;
    }, {});
  }

  private filterRecords(table: EntityTableKey, query: string, searchField?: string): EntityRecord[] {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return this.getAll(table);
    }

    const fields = searchField && searchField !== 'all'
      ? [searchField]
      : schemaFields(table);

    return this.getAll(table).filter(record =>
      fields.some(field => {
        const value = record[field];
        return value !== null && value !== undefined &&
          String(value).toLowerCase().includes(normalizedQuery);
      })
    );
  }

  private sortRecords(
    records: EntityRecord[],
    sortField?: string,
    sortDirection: SortDirection = 'asc'
  ): EntityRecord[] {
    if (!sortField) {
      return records;
    }

    return [...records].sort((left, right) => {
      const comparison = this.compareValues(left[sortField], right[sortField]);
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }

  private compareValues(
    left: string | number | null | undefined,
    right: string | number | null | undefined
  ): number {
    if (left === null || left === undefined || left === '') {
      return 1;
    }

    if (right === null || right === undefined || right === '') {
      return -1;
    }

    const leftNumber = Number(left);
    const rightNumber = Number(right);

    if (!Number.isNaN(leftNumber) && !Number.isNaN(rightNumber)) {
      return leftNumber - rightNumber;
    }

    return String(left).localeCompare(String(right), 'fr', { sensitivity: 'base' });
  }

  private toNumber(value: string | number | null | undefined): number {
    const parsed = Number(value);
    return Number.isNaN(parsed) ? 0 : parsed;
  }

  private readRecords(table: EntityTableKey): EntityRecord[] {
    const rawRecords = localStorage.getItem(`${STORAGE_PREFIX}${table}`);

    if (!rawRecords) {
      return [];
    }

    try {
      return JSON.parse(rawRecords) as EntityRecord[];
    } catch {
      localStorage.removeItem(`${STORAGE_PREFIX}${table}`);
      return [];
    }
  }

  private writeRecords(table: EntityTableKey, records: EntityRecord[]): void {
    localStorage.setItem(`${STORAGE_PREFIX}${table}`, JSON.stringify(records));
  }

  private createId(records: EntityRecord[]): number {
    const highestId = records.reduce((maxId, record) => Math.max(maxId, record.id), 0);
    return highestId + 1;
  }

  private sanitizePayload(
    table: EntityTableKey,
    data: Record<string, string | number | null>
  ): Record<string, string | number | null> {
    const payload = createEmptyRecord(table);

    for (const field of schemaFields(table)) {
      const value = data[field];

      if (value === null || value === undefined || value === '') {
        payload[field] = null;
        continue;
      }

      payload[field] = typeof value === 'number' ? value : String(value).trim();
    }

    return payload;
  }
}
