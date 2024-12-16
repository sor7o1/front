import { AfterViewInit, Component, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';
import { SocketServiceService } from '../../socketService/socket-service.service';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ApiService } from '../../api/api.service';
import Swal from 'sweetalert2'
import { LocalService } from '../../services/local.service';

@Component({
  selector: 'app-car-pedido',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatIconModule, MatButtonModule],
  templateUrl: './car-pedido.component.html',
  styleUrl: './car-pedido.component.css'
})
export class CarPedidoComponent implements OnInit, AfterViewInit {
  displayedColumns = [
    'acciones',
    'nombre',
    'cantidad',
    'subtotal',
    'impuesto',
    'total'
  ];
  displayedTotalColumns = [
    'totalAmountTitle',
    'emptyFooter',
    'emptyFooter'];
  total = 0.0;
  delete(element) {

    Swal.fire({
      title: 'Confirmar',
      text: 'Seguro que deseas quitar el producto del pedido?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No',
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
    }).then((result) => {
      if (result.isConfirmed) {
        let idx = this.dataSource.indexOf(element);

        this.dataSource.splice(idx, 1)

        this.dataSource = [...this.dataSource]
        this.lsts.setItem('pedido', this.dataSource);
        this.socket.test(this.dataSource.length)
        Swal.fire({
          title: "Deleted!",
          text: "Your file has been deleted.",
          icon: "success"
        });
      } else {
        result.dismiss === Swal.DismissReason.cancel
      }
    })


  }

  dataSource = [];
  constructor(private lsts: LocalService, private socket: SocketServiceService, private service: ApiService) {

  }
  ngAfterViewInit(): void {
    try {
      this.socket?.listenPedidos().subscribe((val) => {

        this.getPedido();
      })
    } catch (error) {

    }
  }
  ngOnInit(): void {
    this.getPedido();



  }
  getPedido() {
    let pedidos: [] = this.lsts.getItem('pedido');

    if (pedidos == undefined) return;

    this.dataSource = [...pedidos]
    this.dataSource.map((x) => {

      this.total += x['total']

    })


  }

}
