import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EtiquetasGerencialComponent } from './etiquetas-gerencial.component';

describe('EtiquetasGerencialComponent', () => {
  let component: EtiquetasGerencialComponent;
  let fixture: ComponentFixture<EtiquetasGerencialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EtiquetasGerencialComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EtiquetasGerencialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
