import { Component, Inject, Input, OnDestroy, OnInit, PLATFORM_ID, ViewChild, inject } from "@angular/core";
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatError, MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatCardModule } from "@angular/material/card";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MAT_RADIO_DEFAULT_OPTIONS, MatRadioModule } from "@angular/material/radio";
import { MatIconModule } from "@angular/material/icon";
import { MatDividerModule } from "@angular/material/divider";
import { MatTableModule } from "@angular/material/table";
import { MatGridListModule } from "@angular/material/grid-list";
import { Subject, take } from "rxjs";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { CookieService } from "ngx-cookie-service";
// import { ToastrModule, ToastrService } from 'ngx-toastr';
import {
  MatSnackBar,
  MatSnackBarAction,
  MatSnackBarActions,
  MatSnackBarLabel,
  MatSnackBarRef,
  MatSnackBarModule,
} from "@angular/material/snack-bar";
import { CommonModule, isPlatformBrowser } from "@angular/common";
import { ApiService } from "../api/api.service";
import { ToastContainerDirective, ToastrService } from "ngx-toastr";
import { MatTooltipModule } from "@angular/material/tooltip";
import { ProductsClientComponent } from "./products-client/products-client.component";
import {
  DomSanitizer,
  provideClientHydration,
} from "@angular/platform-browser";
import { SocketServiceService } from "../socketService/socket-service.service";
import { FacturaService } from "../api/factura.service";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { LocalService } from "../services/local.service";



@Component({
  selector: "app-productos",
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatButtonModule,
    MatTooltipModule,
    MatTableModule,
    MatSnackBarModule,
    MatIconModule,
    MatButtonModule,
    CommonModule,
    MatInputModule,
    MatCardModule,
    MatCheckboxModule,
    MatProgressBarModule,
    MatRadioModule,
    MatDividerModule,
    MatGridListModule,
    ReactiveFormsModule,
    ProductsClientComponent,
    MatRadioModule,
    MatProgressSpinnerModule
  ],
  templateUrl: "./productos.component.html",
  styleUrl: "./productos.component.css",
})
export class ProductosComponent implements OnInit, OnDestroy {
  @ViewChild(ToastContainerDirective, { static: true })
  private destroy$: Subject<void> = new Subject<void>();

  toastContainer: ToastContainerDirective;
  base64Image = "";
  imps = [];

  productoForm: FormGroup;
  displayedColumns: string[] = [
    "acciones",
    "nombre",
    "descripcion",
    "disponible",
    "idUser",
    "imagen",
    "precio",
    "imp"
  ];
  dataSource = [];
  sendProducto = false;
  toUpdate = false;
  dataCargada: boolean = false;
  typeUser = 0  ;
  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private api: ApiService,
    private cookie: CookieService,
    public toastr: ToastrService,
    private _sanitazer: DomSanitizer,
    private socket: SocketServiceService,
    private apiImp: FacturaService,
    private localService:LocalService,
    @Inject(PLATFORM_ID) private platformId: any
  ) {

    this.productoForm = this.fb.group({
      _id: [""],
      nombre: ["", Validators.required],
      descripcion: ["", Validators.required],
      disponible: new FormControl(true),
      idCompania: [""],
      idUser: [""],
      imagen: [""],
      precio: ["", Validators.required],
      imp: ['']
    });
  }

  getImpuestos() {
    this.apiImp.getImpuestos().pipe(take(1)).subscribe((res) => {
      if (res['type'] == "ok" && res['data'].length > 0) {
        this.imps = [...[]];
        this.imps = [...res['data']];
      }
    }, error => {
      
      this.toastr.error("Ha ocurrido un error al obtener los datos.", "Error")
    })
  }
  saveProducto() {
    let data = this.productoForm.value;
    

    this.sendProducto = true;
    data["imagen"] = this.base64Image;

    this.api
      .addProducto(data)
      .pipe(take(1))
      .subscribe(
        (res) => {
          this.toastr.success("Agregado correctamente", "Exitosamente");
          setTimeout(() => {
            this.sendProducto = false;
            this.productoForm.reset();
            this.base64Image = "";
            this.getProductos();
          }, 2000);
        },
        (error) => {
          this.toastr.error(
            "Ha ocurrido un errro, comunicate con el administrador.",
            "Error",
          );
        },
      );
  }

  updateProducto() {
    let data = this.productoForm.value;
    this.sendProducto = true;
    data["imagen"] = this.base64Image;

    this.api
      .updateProducto(data)
      .pipe(take(1))
      .subscribe(
        (res) => {
          this.toastr.success("Actualizado correctamente", "Exitosamente");
          setTimeout(() => {
            this.sendProducto = false;
            this.productoForm.reset();
            this.getProductos();
            this.base64Image = "";
          }, 2000);
        },
        (error) => {
          this.toastr.error(
            "Ha ocurrido un errro, comunicate con el administrador.",
            "Error",
          );
        },
      );
  }

  ngOnInit(): void {
    this.typeUser=this.localService.getItem("typeUser");
    this.checkBrowser();


  }
  delete() {
    this.api
      .deleteProducto(this.productoForm.value)
      .pipe(take(1))
      .subscribe(
        (resp) => {
          if (resp["type"] == "ok") {
            this.toastr.success("ELIMINADO CORRECTAMENTE", "Exitosamente");

            // alert(resp['message']);
            this.CloseModel();
            this.getProductos();
          }
        },
        (error) => { },
      );
  }
  edit(elemento) {
    elemento.precio =
      elemento.precio["$numberDecimal"] == undefined
        ? elemento.precio
        : elemento.precio["$numberDecimal"];
    this.productoForm.reset();
    this.productoForm.patchValue(elemento);
    this.toUpdate = true;
    this.base64Image = elemento["imagen"];
  }
  resetImage() {
    this.base64Image = "";
    // this.productoForm.reset("imagen");
    document.getElementById("uploadCaptureInputFile")["value"] = "";
  }
  onFileChange($event: Event) {
    const file = event.target["files"][0];
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.base64Image = e.target.result;
    };
    reader.readAsDataURL(file);
  }
  ver() {
    throw new Error("Method not implemented.");
  }

  get precio() {
    return this.productoForm.get("precio");
  }
  getProductos() {


    this.api
      .getProductoByCompania({ data: "data" })
      .pipe(take(1))
      .subscribe(
        (resp: any) => {


          if (!resp) return;

          this.dataSource = [...resp["data"]];
          this.dataSource.forEach((el) => {
            el["newimg"] = this._sanitazer.bypassSecurityTrustResourceUrl(
              el["imagen"],
            );
          });
          this.dataCargada = true;
        },
        (error) => {


          if (error["statusText"] == "Unauthorized") {
            // this.cookie.deleteAll();
            // localStorage.clear();
            // window.location.reload();
          }
        },
      );
  }


  openModel(elemento) {
    const modelDiv = document.getElementById("myModal");
    if (modelDiv != null) {
      modelDiv.style.display = "block";
      this.productoForm.reset();
      elemento.precio =
        elemento.precio["$numberDecimal"] == undefined
          ? elemento.precio
          : elemento.precio["$numberDecimal"];

      this.productoForm.patchValue(elemento);
    }
  }
  CloseModel() {
    const modelDiv = document.getElementById("myModal");
    if (modelDiv != null) {
      modelDiv.style.display = "none";
      this.productoForm.reset();
    }
  }
  cancelarUpdate() {
    this.toUpdate = false;
    this.sendProducto = false;
    this.base64Image = "";
  }

  

  checkBrowser(){
    if(!isPlatformBrowser(this.platformId))return;
    this.getProductos();
    this.getImpuestos();
    this.toastr.overlayContainer = this.toastContainer;

  }
  ngOnDestroy(): void {
    // this.destroy$.next();
    // this.destroy$.complete();
  }
}
