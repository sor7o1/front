import { AfterViewInit, Component, Inject, OnInit, PLATFORM_ID, ViewChild } from "@angular/core";
import { FacturaService } from "../../api/factura.service";
import { LocalService } from "../../services/local.service";
import { ToastrService } from "ngx-toastr";
import { take } from "rxjs";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatIconModule } from "@angular/material/icon";
import { MatPaginator, MatPaginatorModule } from "@angular/material/paginator";
import { CommonModule, isPlatformBrowser } from "@angular/common";

@Component({
  selector: "app-facturas",
  standalone: true,
  imports: [
    MatTableModule,
    MatButtonModule,
    MatInputModule,
    ReactiveFormsModule,
    FormsModule,
    MatIconModule,
    MatPaginatorModule,
    CommonModule,
  ],
  templateUrl: "./facturas.component.html",
  styleUrl: "./facturas.component.css",
})
export class FacturasComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = [
    "cai",
    "cliente",
    "fecha",
    "subtotal",
    "impuesto",
    "total",
  ];
  dataSource = new MatTableDataSource<any>([]);
  universeDataFacturas = [];

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private api: FacturaService,
    private localService: LocalService,
    private toastr: ToastrService,
    @Inject(PLATFORM_ID) private platformId: any
  ) { }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  ngOnInit() {
    this.checkBrowser();  
  }

  getFacturas() {
    this.api
      .getFacturasByCompany()
      .pipe(take(1))
      .subscribe(
        (res) => {

          let _dataHeader = [];
          if (res["type"] == "ok") {
            let data: [] = res["data"];
            this.universeDataFacturas = data;
            for (var x = 0; x < data.length; x++) {
              data[x]["cliente"] = data[x]["header"]["clienteid"]["nombre"];
              _dataHeader.push(data[x]["header"]);
            }
            this.dataSource = new MatTableDataSource(_dataHeader);
            this.dataSource.paginator = this.paginator;
          }

        },
        (error) => {

          if (error) {
            this.toastr.error(
              "Ha ocurrido un error, comunicate con el administrador!!!",
              "Error",
              {
                timeOut:3000
              }
            );
          }
        },
      );
  }
  deleteRow(row) {

  }
  checkBrowser(){
    if(!isPlatformBrowser(this.platformId))return;
    this.getFacturas();
  }
}
