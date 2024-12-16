import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TiposFacturaComponent } from './tipos-factura.component';

describe('TiposFacturaComponent', () => {
  let component: TiposFacturaComponent;
  let fixture: ComponentFixture<TiposFacturaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TiposFacturaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TiposFacturaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
