import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Ingenieur } from './ingenieur';

describe('Ingenieur', () => {
  let component: Ingenieur;
  let fixture: ComponentFixture<Ingenieur>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Ingenieur],
    }).compileComponents();

    fixture = TestBed.createComponent(Ingenieur);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
