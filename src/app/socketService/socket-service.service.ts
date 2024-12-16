import { Injectable, ApplicationRef } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable, filter, take } from 'rxjs';
import { ObserversModule } from '@angular/cdk/observers';

@Injectable({
  providedIn: 'root'
})
export class SocketServiceService {
  private socket: Socket;

  // private server = "http://localhost:3000";
  private server = "https://backend-sales-8ax7.onrender.com/";
  constructor(private appRef: ApplicationRef) {
  }


  connect() {

    this.socket = io(this.server);
    this.socket.on("connected", (val) => {
      
    })
    this.socket.emit("joinSales", { "cookie": "test" });
  }
  test(size) {
    this.socket.emit("desdeFrontend", size)

  }
  listenPedidos(): Observable<any> {


    
    if(!this.socket)return null;
    return new Observable((subscribe) => {
      this.socket.on("pedidoAgregado", (valor) => {
        subscribe.next(valor);
      })
    });
  }
  listenConfirmarPedido(){
    if(!this.socket)return new Observable((sus)=>sus.next(false));
    return new Observable((subscribe) => {
      this.socket.on("Pedidoconfirmado", (valor) => {
        subscribe.next(valor);
      })
    });
  }
  emitConfirmacionPedido(data){
    this.socket.emit("confirmarPedido",data)
  }

}
