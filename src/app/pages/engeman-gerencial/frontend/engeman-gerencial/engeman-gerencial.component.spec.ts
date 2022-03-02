import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EngemanGerencialComponent } from './engeman-gerencial.component';

describe('EngemanGerencialComponent', () => {
  let component: EngemanGerencialComponent;
  let fixture: ComponentFixture<EngemanGerencialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EngemanGerencialComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EngemanGerencialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
