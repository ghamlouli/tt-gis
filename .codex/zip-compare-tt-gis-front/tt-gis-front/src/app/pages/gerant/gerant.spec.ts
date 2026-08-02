import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Gerant } from './gerant';

describe('Gerant', () => {
  let component: Gerant;
  let fixture: ComponentFixture<Gerant>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Gerant],
    }).compileComponents();

    fixture = TestBed.createComponent(Gerant);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
