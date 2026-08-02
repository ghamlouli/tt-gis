import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';

import {
  ENTITY_LABELS,
  EntityCrudPageData,
  EntityRecord,
  EntityTableKey
} from '../../models/entity.model';
import {
  FieldConfig,
  createEmptyRecord,
  formatFieldValue,
  getDisplayColumns,
  getFieldConfigs
} from '../../models/field-config';
import { EntityCrudService, SortDirection } from '../../services/entity-crud.service';

type CrudMode = 'create' | 'edit' | 'view' | 'delete' | null;

@Component({
  selector: 'app-entity-crud-page',
  standalone: true,
  imports: [NgFor, NgIf, FormsModule],
  templateUrl: './entity-crud-page.html',
  styleUrl: './entity-crud-page.css'
})
export class EntityCrudPageComponent implements OnInit {
  readonly page: EntityCrudPageData;
  readonly entityLabels = ENTITY_LABELS;

  activeEntity!: EntityTableKey;
  records: EntityRecord[] = [];
  fieldConfigs: FieldConfig[] = [];
  displayColumns: string[] = [];
  searchQuery = '';
  searchField = 'all';
  sortField = '';
  sortDirection: SortDirection = 'asc';
  formData: Record<string, string | number | null> = {};
  selectedRecord: EntityRecord | null = null;
  modalMode: CrudMode = null;
  feedbackMessage = '';
  feedbackType: 'success' | 'error' = 'success';

  constructor(
    private route: ActivatedRoute,
    private entityCrudService: EntityCrudService
  ) {
    this.page = this.route.snapshot.data as EntityCrudPageData;
    this.activeEntity = this.page.entities[0];
  }

  ngOnInit(): void {
    this.loadEntityData();
  }

  get hasMultipleEntities(): boolean {
    return this.page.entities.length > 1;
  }

  get modalTitle(): string {
    return this.entityLabels[this.activeEntity];
  }

  get modalBadge(): string {
    switch (this.modalMode) {
      case 'create':
        return 'Ajout';
      case 'edit':
        return 'Modification';
      case 'view':
        return 'Consultation';
      case 'delete':
        return 'Suppression';
      default:
        return '';
    }
  }

  selectEntity(entity: EntityTableKey): void {
    if (this.activeEntity === entity) {
      return;
    }

    this.activeEntity = entity;
    this.resetFilters();
    this.closeModal();
    this.loadEntityData();
  }

  loadEntityData(): void {
    this.fieldConfigs = getFieldConfigs(this.activeEntity);
    this.displayColumns = getDisplayColumns(this.activeEntity);
    this.sortField = this.displayColumns[0] ?? '';
    this.refreshRecords();
  }

  refreshRecords(): void {
    this.records = this.entityCrudService.query(this.activeEntity, {
      query: this.searchQuery,
      searchField: this.searchField,
      sortField: this.sortField || undefined,
      sortDirection: this.sortDirection
    });
  }

  onFiltersChange(): void {
    this.refreshRecords();
  }

  toggleSortDirection(): void {
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    this.refreshRecords();
  }

  resetFilters(): void {
    this.searchQuery = '';
    this.searchField = 'all';
    this.sortDirection = 'asc';
  }

  openCreate(): void {
    this.modalMode = 'create';
    this.selectedRecord = null;
    this.formData = createEmptyRecord(this.activeEntity);
  }

  openView(record: EntityRecord): void {
    this.modalMode = 'view';
    this.selectedRecord = record;
    this.formData = { ...record };
  }

  openEdit(record: EntityRecord): void {
    this.modalMode = 'edit';
    this.selectedRecord = record;
    this.formData = { ...record };
  }

  openDelete(record: EntityRecord): void {
    this.modalMode = 'delete';
    this.selectedRecord = record;
  }

  closeModal(): void {
    this.modalMode = null;
    this.selectedRecord = null;
    this.formData = {};
  }

  saveRecord(): void {
    if (this.modalMode === 'create') {
      this.entityCrudService.create(this.activeEntity, this.formData);
      this.showFeedback('Enregistrement créé avec succès.');
    } else if (this.modalMode === 'edit' && this.selectedRecord) {
      this.entityCrudService.update(this.activeEntity, this.selectedRecord.id, this.formData);
      this.showFeedback('Enregistrement modifié avec succès.');
    }

    this.closeModal();
    this.refreshRecords();
  }

  confirmDelete(): void {
    if (!this.selectedRecord) {
      return;
    }

    const deleted = this.entityCrudService.delete(this.activeEntity, this.selectedRecord.id);

    if (deleted) {
      this.showFeedback('Enregistrement supprimé avec succès.');
    } else {
      this.showFeedback('Impossible de supprimer cet enregistrement.', 'error');
    }

    this.closeModal();
    this.refreshRecords();
  }

  formatValue(value: string | number | null | undefined): string {
    return formatFieldValue(value);
  }

  getFieldLabel(fieldName: string): string {
    return this.fieldConfigs.find(field => field.name === fieldName)?.label ?? fieldName;
  }

  getEntityCount(entity: EntityTableKey): number {
    return this.entityCrudService.count(entity);
  }

  getRecordLabel(record: EntityRecord): string {
    const primaryField = this.displayColumns[0];
    const value = record[primaryField];

    if (value !== null && value !== undefined && value !== '') {
      return String(value);
    }

    const fallbackField = this.fieldConfigs.find(field => record[field.name]);
    if (fallbackField) {
      return String(record[fallbackField.name]);
    }

    return 'cet enregistrement';
  }

  private showFeedback(message: string, type: 'success' | 'error' = 'success'): void {
    this.feedbackMessage = message;
    this.feedbackType = type;

    window.setTimeout(() => {
      this.feedbackMessage = '';
    }, 3500);
  }
}
