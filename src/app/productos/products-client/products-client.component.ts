import { Component, ElementRef, Inject, Input, OnInit, QueryList, ViewChildren } from "@angular/core";
import { ApiService } from "../../api/api.service";
import { take } from "rxjs";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { CommonModule } from "@angular/common";
import { MatIconModule } from "@angular/material/icon";
import { DomSanitizer } from "@angular/platform-browser";
import { SocketServiceService } from "../../socketService/socket-service.service";
import { Popover } from "bootstrap";
import { LocalService } from "../../services/local.service";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";

interface Products {
  idProducto: string;
  cantidad: number;
  subtotal: number;
  total: number;
  nombre: string,
  impuesto: number
}


@Component({
  selector: "app-products-client",
  standalone: true,
  imports: [MatButtonModule, MatCardModule, CommonModule, MatIconModule,MatProgressSpinnerModule],
  templateUrl: "./products-client.component.html",
  styleUrl: "./products-client.component.css",
})
export class ProductsClientComponent implements OnInit {

  @Input() fromProducts: string;
  @ViewChildren('popoverItem')
  public popoverItem!: QueryList<ElementRef<HTMLLIElement>>;
  productos = [];
  tempPedido = [];

  productosBycompanie: {
    nameCompanie: String;
    idCompanie: String;
    data: any[];
  }[];
  dataCargada:boolean=false;
  constructor(
    private api: ApiService,
    private _sanitazer: DomSanitizer,
    private tempStorage: LocalService,
    private socket: SocketServiceService,

  ) {

    this.getAllProductos();
  }
  ngOnInit(): void {

  }

  saveTemporaryShop(data): void {

    

    let precio = data['precio']['$numberDecimal'];
    let _imp = data['imp']===undefined?0.0:data['imp']['$numberDecimal'];
    let subtotal = Number(precio * 1);
    let imp = Number(subtotal * _imp);
    let total = Number(imp + subtotal);
    let id = this.tempStorage.getItem('idUser')

    

    const prods: Products = {
      idProducto: data['_id'],
      nombre: data['nombre'], cantidad: 1,
      subtotal: subtotal,
      total: total,
      impuesto: imp
    }
    let oldPedido = [];
    let pedido = this.tempStorage.getItem('pedido');


    if (this.tempPedido.length > 0 || (pedido != undefined && pedido.length > 0)) {
      oldPedido = pedido;
      const result = oldPedido.find((val) => val['idProducto'] === prods['idProducto']);
      if (result != undefined) {
        result['cantidad'] += prods['cantidad'];
        result['subtotal'] = result['cantidad'] * precio;
        result['impuesto'] = result['subtotal'] * _imp;
        result['total'] = result['impuesto'] + result['subtotal']
      } else {
        oldPedido.push(prods)
      }
      this.tempStorage.setItem('pedido', oldPedido);
      this.socket.test(oldPedido.length)
      return;
    }
    this.tempPedido.push(prods)

    this.tempStorage.setItem('pedido', this.tempPedido);
    this.socket.test(this.tempPedido.length)
  }

  getAllProductos() {
    this.api
      .getProducts()
      .pipe(take(1))
      .subscribe(
        (resp) => {
          if (resp["type"] == "ok") {
            this.productos = resp["data"];
            const companies = this.productos.reduce((acc, cur) => {
              (acc[cur["idCompania"]["_id"]] =
                acc[cur["idCompania"]["_id"]] || []).push(cur);
              return acc;
            }, {});

            this.productosBycompanie = Object.keys(companies).map((key) => ({
              nameCompanie: undefined,
              idCompanie: key,
              data: companies[key],
            }));
            this.productosBycompanie.map((el) => {
              this.productos.forEach((element) => {
                element["newImage"] =
                  this._sanitazer.bypassSecurityTrustResourceUrl(
                    element["imagen"],
                  );
                if (el["idCompanie"] == element["idCompania"]["_id"]) {
                  el["nameCompanie"] = element["idCompania"]["nombre"];
                }
              });
            });
            this.dataCargada=true;
          }
        },
        (error) => { },
      );
  }
  setValue($event) {


  }
}
