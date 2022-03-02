import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraficoOsComponent } from './grafico-os.component';

describe('GraficoOsComponent', () => {
  let component: GraficoOsComponent;
  let fixture: ComponentFixture<GraficoOsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GraficoOsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GraficoOsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
