import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PuntoEmisionComponent } from './punto-emision.component';

describe('PuntoEmisionComponent', () => {
  let component: PuntoEmisionComponent;
  let fixture: ComponentFixture<PuntoEmisionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PuntoEmisionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PuntoEmisionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
