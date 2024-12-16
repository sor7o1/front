import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarPedidoComponent } from './car-pedido.component';

describe('CarPedidoComponent', () => {
  let component: CarPedidoComponent;
  let fixture: ComponentFixture<CarPedidoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarPedidoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CarPedidoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
