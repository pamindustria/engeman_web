import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocaComponent } from './doca.component';

describe('DocaComponent', () => {
  let component: DocaComponent;
  let fixture: ComponentFixture<DocaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
