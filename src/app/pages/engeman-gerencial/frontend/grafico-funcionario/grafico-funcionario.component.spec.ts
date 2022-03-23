import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraficoFuncionarioComponent } from './grafico-funcionario.component';

describe('GraficoFuncionarioComponent', () => {
  let component: GraficoFuncionarioComponent;
  let fixture: ComponentFixture<GraficoFuncionarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GraficoFuncionarioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GraficoFuncionarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
