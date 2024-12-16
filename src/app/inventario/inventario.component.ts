import {
  animate,
  state,
  style,
  transition,
  trigger,
} from "@angular/animations";
import { CommonModule, isPlatformBrowser } from "@angular/common";
import { Component, Inject, OnInit, PLATFORM_ID, ViewChild } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import {
  MatOptionModule,
  MatOptionSelectionChange,
} from "@angular/material/core";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatListModule } from "@angular/material/list";
import { MatSelectModule } from "@angular/material/select";
import { MatSort } from "@angular/material/sort";
import {
  MatTable,
  MatTableDataSource,
  MatTableModule,
} from "@angular/material/table";
import { ToastrService } from "ngx-toastr";
import { take } from "rxjs";
import Swal from "sweetalert2";
import { ApiService } from "../api/api.service";
import { InventarioService } from "../api/inventario.service";
import { LocalService } from "../services/local.service";
import { log } from "console";
import { MatTooltipModule } from "@angular/material/tooltip";

let element = {
  cantidad: 0,
  producto: "init",
  saved: false,
  edit: false,
  idProducto: "",
};

@Component({
  selector: "app-inventario",
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    MatTableModule,
    MatInputModule,
    MatOptionModule,
    MatSelectModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    CommonModule,
    MatCardModule,
    MatListModule,
    MatTooltipModule,
  ],
  templateUrl: "./inventario.component.html",
  styleUrl: "./inventario.component.css",
  animations: [
    trigger("detailExpand", [
      state("collapsed,void", style({ height: "0px", minHeight: "0" })),
      state("expanded", style({ height: "*" })),
      transition(
        "expanded <=> collapsed",
        animate("225ms cubic-bezier(0.4, 0.0, 0.2, 1)"),
      ),
    ]),
  ],
})
export class InventarioComponent implements OnInit {
  show(row, index) {
    row["show"] = !row["show"];
    let detalle = row["detalle"];
    this.dataSourceInventariosDetalle = new MatTableDataSource(detalle);
  }
  @ViewChild(MatTable) table: MatTable<any>;
  @ViewChild(MatSort) sort: MatSort;
  invForm: FormGroup = new FormGroup({});
  prodForm: FormGroup = new FormGroup({});
  prods = [];
  invs = [];
  selected: any;
  invDetalles = [];
  dataSource: MatTableDataSource<any>;
  dataSourceInventarios: MatTableDataSource<any>;
  dataSourceInventariosDetalle: MatTableDataSource<any>;
  tempData = [];
  test = 1;
  typeUser = 1;
  displayedColumns: string[] = ["actions", "producto", "cantidad"];
  displayedColumnsDetalle: string[] = ["producto", "cantidad"];
  displayedColumnsInventario: string[] = [
    "actions",
    "nombre",
    "descripcion",
    "creadopor",
    "fecha",
  ];
  columnsToDisplayWithExpand = [...this.displayedColumnsInventario, "expand"];
  expandedElement: any | null;
  constructor(
    private ls: LocalService,
    private api: InventarioService,
    private apiProd: ApiService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    @Inject(PLATFORM_ID) private platformId: any
  ) {
    this.invForm = this.fb.group({
      _id: [""],
      nombre: ["", Validators.required],
      descripcion: [""],
      typeInventario: ["entrada"],
    });
    this.prodForm = this.fb.group({
      producto: [""],
      cantidad: [1],
    });
    this.dataSource = new MatTableDataSource([element]);
  }

  ngOnInit(): void {
    if(!(isPlatformBrowser(this.platformId)))return;
    this.getInventarios();
    // this.dataSource.push({ 'cantidad': '0', 'producto': '0' })
    this.getProductosByCompania();
  }
  getProductosByCompania() {
    this.apiProd
      .getProductoByCompania({ any: "any" })
      .pipe(take(1))
      .subscribe((res) => {
        if (res["type"] == "ok" && res["data"].length > 0) {
          this.prods = [...res["data"]];
        }
      });
  }
  saveInventario() {
    let paso = this.tempData.length <= 1 ? false : true;

    !paso
      ? this.toastr.warning("No has agregado ningun producto", "Warning")
      : "";

    if (!paso) return;
    if (this.invForm.valid) {
      if (this.invForm.value["_id"]) {
        this.tempData.splice(this.tempData.length - 1, 1);
        this.api
          .updateInventario(this.invForm.value, this.tempData)
          .pipe(take(1))
          .subscribe(
            (res) => {
              if (res["type"] == "ok") {
                this.invForm.reset();
                this.dataSource.data.length = 0;
                this.dataSource = new MatTableDataSource([element]);
                this.toastr.success("Actualizado exitosamente", "Exitosamente");
                this.getInventarios();
              }
            },
            (error) => {
              this.toastr.error(
                "Ha ocurrido un error comunicate con el administrador",
                "Error",
              );
            },
          );
      } else {
        this.tempData.splice(this.tempData.length - 1, 1);
        this.api
          .saveInventario(this.invForm.value, this.tempData)
          .pipe(take(1))
          .subscribe(
            (res) => {
              if (res["type"] == "ok") {
                this.toastr.success("Creado exitosamente", "Exitosamente");
                this.invForm.reset();
                this.dataSource.data.length = 0;
                this.dataSource = new MatTableDataSource([element]);
                this.getInventarios();
              }
            },
            (error) => {
              this.toastr.error(
                "Ha ocurrido un error comunicate con el administrador",
                "Error",
              );
            },
          );
      }
    } else {
      this.toastr.warning("Rellena todos los campos", "Warning");
    }
  }

  addRow(idx) {
    this.prodForm.reset();
    let paso = true;

    if (
      this.tempData[idx - 1] !== undefined &&
      !this.tempData[idx - 1]["saved"]
    ) {
      paso = false;
      this.toastr.warning("Tienes que guardar los datos", "Informacion");
    }

    if (this.tempData.length > 1) {
      this.tempData.splice(this.tempData.length - 1, 1);
    }
    // if(this.tempData[this.tempData-1])
    if (!paso) return;
    let add = {
      cantidad: this.test++,
      producto: "falta producto",
      saved: false,
      edit: false,
    };
    this.tempData.push(add);
    this.tempData.push(element);

    this.dataSource = new MatTableDataSource(this.tempData);
  }
  savedRow(index, row) {
    const ids = {};
    let saved = true;
    for (const ele of this.tempData) {
      let id = ele["idProducto"];
      if (ids[id]) {
        ids[id] += 1;
      } else if (id !== "") {
        ids[id] = 1;
      }
    }
    if (this.tempData[index]["producto"] === "falta producto") {
      this.toastr.warning("El elemento que deseas agregar ya existe");
      saved = false;
    }

    if (!saved) return;
    this.tempData[index]["saved"] = true;
    this.tempData = [...this.tempData];
    this.dataSource = new MatTableDataSource(this.tempData);
  }

  changeCantidad(key, index) {
    this.tempData[index]["cantidad"] = key["value"];
  }

  changeProducto($event: MatOptionSelectionChange<any>, index) {
    let arr = [];
    for (let i = 0; i < this.tempData.length - 1; i++) {
      let existe = arr.find((l) => l["_id"] == $event.source.value["_id"]);
      if (existe === undefined) {
        arr.push({ _id: $event.source.value["_id"], count: 1 });
      } else {
        existe["count"]++;
      }
    }
    let find = this.tempData.find(
      (m) => m["idProducto"] === $event.source.value["_id"],
    );
    let paso = find === undefined ? true : false;
    !paso && arr[0]["count"] >= 2
      ? this.toastr.warning("El producto ya existe", "Warning")
      : "";

    if (!paso) return;
    this.tempData[index]["producto"] = $event.source.value["nombre"];
    this.tempData[index]["idProducto"] = $event.source.value["_id"];
  }
  cancel(index, ele) {
    this.tempData.splice(index, 1);
  }
  deleteItem(index) {
    Swal.fire({
      title: "Eliminar",
      text: "Seguro que deseas eliminar el  punto de emisión?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Si",
      cancelButtonText: "No",
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
    }).then((result) => {
      if (result.isConfirmed) {
        this.tempData.splice(index, 1);
        this.tempData = [...this.tempData];
        this.dataSource = new MatTableDataSource(this.tempData);
      } else {
        result.dismiss === Swal.DismissReason.cancel;
      }
    });
  }
  getInventarios() {
    this.api
      .getInventariosByCompania()
      .pipe(take(1))
      .subscribe(
        (res) => {
          this.toastr.success("Data cargada", "Exitosamente");
          if (res["type"] == "ok") {
            let data: [] = res["data"];
            this.dataSourceInventarios = new MatTableDataSource(data);
          }
        },
        (error) => {
          this.toastr.error(
            "Ha ocurrido un error, comunicate con el administrados",
            "Error",
          );
        },
      );
  }
  deleteInventario(row, index) {
    row["disabled"] = true;

    Swal.fire({
      title: "Eliminar",
      text: "Seguro que deseas eliminar el  punto de emisión?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Si",
      cancelButtonText: "No",
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
    }).then((result) => {
      if (result.isConfirmed) {
        this.dataSourceInventarios.data.splice(index, 1);
        this.api
          .deleteInventario(row)
          .pipe(take(1))
          .subscribe(
            (res) => {
              this.getInventarios();
              this.toastr.success("Eliminado correctamente", "Exitosamente");
            },
            (error) => {
              this.toastr.error(
                "Ha ocurrido un error, comunicate con el administrador",
                "Error",
              );
            },
          );

        // this.getInventarios();
      } else {
        result.dismiss === Swal.DismissReason.cancel;
        row["disabled"] = false;
      }
    });
  }
  editInventario(row) {
    let _inv = {
      _id: row["header"]["_id"],
      nombre: row["header"]["nombre"],
      descripcion: row["header"]["descripcion"],
    };
    this.invForm.patchValue(_inv);
    if (row["detalle"].length == 0) return;
    this.tempData = [...[]];
    if (row["detalle"].length > 0) {
      row["detalle"].forEach((ele) => {
        ele["saved"] = true;
        ele["edit"] = false;
        ele["cantidad"] = ele["stock"]["$numberDecimal"];
        ele["producto"] = ele["productoId"]["nombre"];
        ele["idProducto"] = ele["productoId"]["_id"];
      });
      this.tempData = [...row["detalle"]];
    }

    this.tempData = [...this.tempData];
    this.tempData.push(element);
    this.dataSource = new MatTableDataSource(this.tempData);
  }

  editRow(row, index) {
    this.prodForm.reset();

    row["saved"] = false;
    let find = this.prods.find((m) => m["_id"] === row["idProducto"]);
    this.prodForm.get("producto").setValue(find);
    this.prodForm.get("cantidad").setValue(row["cantidad"]);
  }
  deleteRow(row, index) {
    this.tempData.splice(index, 1);
    this.tempData = [...this.tempData];
    this.dataSource = new MatTableDataSource(this.tempData);
  }
}
