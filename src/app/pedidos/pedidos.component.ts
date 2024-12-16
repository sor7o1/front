import { AfterViewInit, Component, Inject, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ApiService } from '../api/api.service';
import { SocketServiceService } from '../socketService/socket-service.service';
import { take } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DetallePedidoComponent } from './detalle-pedido/detalle-pedido.component';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { LocalService } from '../services/local.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PdfService } from '../pdf/pdf.service';
import { FacturaService } from '../api/factura.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

export interface PedidoShow {
  nameCompany: string,
  fecha: Date,
  detalle: Array<any>
}
@Component({
  selector: 'app-pedidos',
  standalone: true,
  animations: [
    trigger('detailExpand', [
      state('collapsed,void', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
  imports: [MatTableModule, 
    MatProgressSpinnerModule, 
    MatButtonModule, 
    MatIconModule, 
    CommonModule, 
    MatPaginatorModule, 
    MatFormFieldModule, 
    MatInputModule,
  FontAwesomeModule],
  templateUrl: './pedidos.component.html',
  styleUrl: './pedidos.component.css'
})

export class PedidosComponent implements OnInit, AfterViewInit {
  // 'impuesto',
  // 'total'
  applyFilter($event: KeyboardEvent) {
    throw new Error('Method not implemented.');
  }
  displayedColumns = [
    'acciones',
    'nameCompany',
    'fecha'
    // 'impuesto',
    // 'total'
  ];
  typeUser = 0;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource: any[] = [];

  pedido = new MatTableDataSource<PedidoShow>(this.dataSource);
  detallePedido = [];
  columnsToDisplayWithExpand = [...this.displayedColumns, 'expand'];
  expandedElement: PedidoShow | null;

  constructor(
    private service: ApiService,
    private facservice: FacturaService,
    private socket: SocketServiceService,
    private lcstr: LocalService,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private gpdf: PdfService,
    @Inject(PLATFORM_ID) private platformId: any) { }
  
    checkBrowser(){
      if(!isPlatformBrowser(this.platformId))return;
    
        this.socket.listenConfirmarPedido().subscribe((pedido) => {
    
    
        })
        this.typeUser = this.lcstr.getItem('typeUser')
        this.displayedColumns[1] = this.typeUser == 1 || this.typeUser == 2 ? 'nombreCliente' : 'nameCompany'
    
        this.typeUser == 3 ? this.getPedidosByUser() : this.getPedidosByCompany();
     

    }

  ngOnInit(): void {
  this.checkBrowser();

  }
  ngAfterViewInit() {
    // this.typeUser = this.lcstr.getItem('typeUser')
    // this.displayedColumns[1] = this.typeUser == 1 || this.typeUser == 2 ? 'nombreCliente' : 'nameCompany'


    // this.pedido.paginator = this.paginator;
  }

  delete(element) {
    let idx = this.dataSource.indexOf(element);
    this.dataSource.splice(idx, 1)
    this.dataSource = [...this.dataSource]
    this.socket.test(this.dataSource.length)
  }
  confirmarPedido(data) {
    this.socket.emitConfirmacionPedido(data);
  }

  getPedidosByUser() {
    this.service.getPedidosByUser().pipe(take(1)).subscribe((resp) => {


      if (resp['type'] == "ok" && resp['data']) {
        this.dataSource = [];
        this.detallePedido = [];

        resp['data'].forEach(element => {
          element['nameCompany'] = element['pedido']['idCompania']['nombre']
          element['fecha'] = element['pedido']['fecha']
          element['nombreCliente'] = element['pedido']['idUsuario']['nombre']
          this.dataSource.push(element);

          element['detalle'].forEach(element2 => {
            element2['nombre'] = element2['idProducto']['nombre']
            element2['descripcion'] = element2['idProducto']['descripcion']
            this.detallePedido.push(element2);
          });

        });

        this.dataSource = [...this.dataSource];
        this.detallePedido = [...this.detallePedido];
        // this.dataSource = [...resp['data']];
      }
    }, error => {

      this.toastr.error(error['statusText'], "Error")

    })

  }
 
  getPedidosByCompany() {
    this.service.getPedidosByCompania().pipe(take(1)).subscribe((resp) => {
      console.log(resp)


      if (resp['type'] == "ok" && resp['data']) {
        this.dataSource = [];
        this.detallePedido = [];

        resp['data'].forEach(element => {
          element['nameCompany'] = element['pedido']['idCompania']['nombre']
          element['fecha'] = element['pedido']['fecha']
          element['nombreCliente'] = element['pedido']['idUsuario']['nombre']
          this.dataSource.push(element);

          element['detalle'].forEach(element2 => {
            element2['nombre'] = element2['idProducto']['nombre']
            element2['descripcion'] = element2['idProducto']['descripcion']
            this.detallePedido.push(element2);
          });

        });

        this.dataSource = [...this.dataSource];
        this.detallePedido = [...this.detallePedido];
        // this.dataSource = [...resp['data']];
      }
    }, error => {
      this.toastr.error(error['statusText'], "Error")

    })
  }

  openDialog(element) {

    const dialogRef = this.dialog.open(DetallePedidoComponent, {
      data: { data: element['detalle'], pedido: element['pedido'] },

    });
    dialogRef.afterClosed().subscribe(result => {

    })

  }


}
