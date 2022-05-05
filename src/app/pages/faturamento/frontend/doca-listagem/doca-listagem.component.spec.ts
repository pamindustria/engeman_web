import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocaListagemComponent } from './doca-listagem.component';

describe('DocaListagemComponent', () => {
  let component: DocaListagemComponent;
  let fixture: ComponentFixture<DocaListagemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocaListagemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocaListagemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
