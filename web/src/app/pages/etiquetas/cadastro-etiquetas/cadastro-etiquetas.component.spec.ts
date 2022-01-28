import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastroEtiquetasComponent } from './cadastro-etiquetas.component';

describe('CadastroEtiquetasComponent', () => {
  let component: CadastroEtiquetasComponent;
  let fixture: ComponentFixture<CadastroEtiquetasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CadastroEtiquetasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CadastroEtiquetasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
