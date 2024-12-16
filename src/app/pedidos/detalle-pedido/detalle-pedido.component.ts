import { CommonModule } from "@angular/common";
import { Component, Inject, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogModule,
  MatDialogRef,
  MatDialogTitle,
} from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatTableModule } from "@angular/material/table";
import { CalculosService } from "../../services/calculos.service";
import { ApiService } from "../../api/api.service";
import { take } from "rxjs";

import Swal from "sweetalert2";
import { SocketServiceService } from "../../socketService/socket-service.service";
import { ToastrService } from "ngx-toastr";
import { LocalService } from "../../services/local.service";
import { PdfService } from "../../pdf/pdf.service";
import { FacturaService } from "../../api/factura.service";
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faFilePdf } from '@fortawesome/free-solid-svg-icons'
@Component({
  selector: "app-detalle-pedido",
  standalone: true,
  imports: [
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    FontAwesomeModule
  ],
  templateUrl: "./detalle-pedido.component.html",
  styleUrl: "./detalle-pedido.component.css",
})
export class DetallePedidoComponent implements OnInit {
  // icons 
  faPdf = faFilePdf
  //
  typeUser = 3;
  detalle: any;
  header: any;
  editar = false;
  facturado=false;
  confirmados=[];
  newCantidad = 0;
  headersColum = [
    "acciones",
    "nombre",
    "descripcion",
    "cantidad",
    "subtotal",
    "impuesto",
    "total",
    "confirmado",
  ];
  displayedTotalColumns = ["totalAmountTitle", "emptyFooter", "emptyFooter"];
  total: number = 0.0;
  cais = [];
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: [],
    public dialog: MatDialog,
    private cal: CalculosService,
    private lcstr: LocalService,
    private service: ApiService,
    private facturaService: FacturaService,
    private socket: SocketServiceService,
    private toastr: ToastrService,
    public gpdf: PdfService,
  ) { }
  ngOnInit(): void {
    this.typeUser = this.lcstr.getItem("typeUser");
    let to = 0;
    let subto = 0;
    let imp = 0;
    let _data = this.data["data"];
    console.log(_data[0]['idPedido']);
    
    // this.getFactura(_this.d);
    for (let index = 0; index < _data.length; index++) {
      
      
      to += parseFloat(_data[index]["total"]["$numberDecimal"]);
      subto += parseFloat(
        _data[index]["subtotal"]["$numberDecimal"],
      );
      imp += parseFloat(_data[index]["impuesto"]["$numberDecimal"]);
      _data[index]['confirmado']?this.confirmados.push(true):'';
    }
    this.total = to;
    this.data["pedido"]["subtotal"] = subto;
    this.data["pedido"]["impuesto"] = imp;
    this.data["pedido"]["total"] = this.total;
    this.getCai();
    console.log("ENDLINE",this.confirmados);



  }

  async getFactura(id) {
    await this.facturaService.getFacturasByPedido(id).pipe(take(1)).subscribe((resp) => {
      if (resp['type'] == "ok" && resp['data'].length > 0) {
        let _data = [...resp['data']];
        let _data2 = this.data['data']
        for (let i = 0; i < _data.length; i++) {
          for (let j = 0; j < _data2.length; j++) {
            if(_data2[j]['idPedido']===_data[i]['header']['pedidoId']){
              _data2[j]['factura'] = true;
              this.facturado=true;
            }else{
              _data2[j]['factura'] = false;

            }
          }
        }
      }
    })
  }
  saveFactura(cai) {
    let result = this.cais.find((m) => m["_id"] == cai);

    let obj = {
      detalle: this.data,
      headerFactura: result,
    };
    this.facturaService
      .saveFactura(obj)
      .pipe(take(1))
      .subscribe(
        (res) => {

        },
        (error) => {

        },
      );
  }
  confirmarFactura() {
    let obj = {};
    for (const key in this.cais) {
      let _id = this.cais[key]["_id"];
      obj[_id] = this.cais[key]["numeroAutorizacion"];
    }

    Swal.fire({
      title: "Seleccione EL CAI",
      input: "select",
      inputOptions: obj,
      inputAttributes: {
        autocapitalize: "off",
      },
      showCancelButton: true,
      confirmButtonText: "Look up",
      showLoaderOnConfirm: true,
    }).then((result) => {
      if (result.isConfirmed) {
        this.saveFactura(result["value"]);
      }
    });
  }

  edit(element): void {
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      data: this.newCantidad,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result > 0) {
        let temp = [];
        temp = this.data;
        const resultData = temp.find((f) => f["_id"] === element["_id"]);

        let precio = element["idProducto"]["precio"]["$numberDecimal"];
        let imp =
          element["idProducto"]["imp"] == undefined
            ? 0.0
            : element["idProducto"]["imp"]["$numberDecimal"];
        let calcular = this.cal.calcularTotal(result, precio, imp);
        resultData["cantidad"] = result;
        resultData["subtotal"] = calcular["subtotal"];
        resultData["total"] = calcular["total"];
        resultData["impuesto"] = calcular["impuesto"];
        this.data['results'] = resultData;
        this.data = [...this.data];
        this.editar = true;
      }
      this.newCantidad = result;
    });
  }
  updateEstado(element) {
    element["confirmado"] = element["confirmado"] ? false : true;
    this.service
      .updatePedidoEstado(element)
      .pipe(take(1))
      .subscribe(
        (resp) => {
          this.socket.emitConfirmacionPedido(element);
        },
        (error) => {
          this.toastr.error("error");
        },
      );
  }
  getCai() {
    let id = this.lcstr.getItem("idCompania");
    this.facturaService
      .getCaiById(id)
      .pipe(take(1))
      .subscribe(
        (res) => {
          if (res["type"] == "ok") {
            this.cais = [...res["data"]];
          }
        },
        (error) => {


        },
      );
  }
  pedidoFacturado(){
    console.log("GO to factura");
    
    
  }

  generarFactura(_cai) {


    this.gpdf.generarPDF(this.data['data'], this.data['pedido'], this.data['results'], _cai);
  }
  async selectCai() {

    let _cais: Object = {};
    this.cais.forEach((val) => {
      _cais[val['_id']] = val['numeroAutorizacion']

    })

    const { value: cai } = await Swal.fire({
      title: "Seleccione un CAI valido",
      input: "select",
      inputOptions: {
        Cais: _cais
      },
      inputPlaceholder: "Seleccione el CAI",
      showCancelButton: true,

    });
    if (cai) {
      let _caiFind = await this.cais.find((c) => c['_id'] === cai);

      this.saveFacturaServer(_caiFind);
    }
  }

  saveFacturaServer(_cai) {
    let _data = this.data;
    _data['detalle'] = {};
    _data['detalle']['pedido'] = _data['pedido'];
    _data['detalle']['data'] = _data['data'];
    _data['headerFactura'] = _cai;

    this.facturaService.saveFactura(_data).pipe(take(1)).subscribe((resp) => {

      if (resp['type'] == "ok") {
        _cai['numInifactura'] = resp['data']['header']['numInifactura']
        this.generarFactura(_cai)
      }

    })
  }
}

@Component({
  selector: "editar_pedido",
  templateUrl: "editar_pedido.html",
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
  ],
})
export class DialogOverviewExampleDialog {
  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public cantidad: any,
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
