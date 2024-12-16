import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CalculosService {

  constructor() { }
  calcularTotal(cantidad,precio,imp){
    let subtotal=cantidad*precio;
    let impuesto=imp*subtotal
    let calculo={
      "impuesto":impuesto,
      "total":impuesto+subtotal,
      "subtotal": subtotal
    }
    return calculo;
  }
}
