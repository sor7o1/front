import {
  Component,
  ViewChild,
  OnInit,
  OnChanges,
  SimpleChanges,
  NgZone,
  ɵglobal,
  AfterViewInit,
  importProvidersFrom,
  inject,
  ApplicationRef,
  Output,
  EventEmitter,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from "@angular/router";

import { MatToolbarModule } from "@angular/material/toolbar";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatMenuModule, MatMenuTrigger } from "@angular/material/menu";
import {
  MatDrawerContent,
  MatSidenav,
  MatSidenavModule,
} from "@angular/material/sidenav";
import { MatListModule } from "@angular/material/list";
import { MatBadgeModule } from "@angular/material/badge";
import { MatFormFieldModule } from "@angular/material/form-field";
import { CookieService } from "ngx-cookie-service";
import { LoadingComponent } from "./loading/loading.component";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { ToastrService } from "ngx-toastr";
import { SocketServiceService } from "./socketService/socket-service.service";
import { MatAccordion, MatExpansionModule } from "@angular/material/expansion";
import { Subject, debounceTime, fromEvent, take, tap } from "rxjs";
import { CarPedidoComponent } from "./pedidos/car-pedido/car-pedido.component";
import { ApiService } from "./api/api.service";
import Swal from "sweetalert2";
import { LocalService } from "./services/local.service";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { DomainServiceService } from "./domainService/domain-service.service";

@Component({
  selector: "app-root",
  standalone: true,
  host: { ngSkipHydration: "true" },
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.css",
  imports: [
    CommonModule,
    RouterOutlet,
    MatToolbarModule,
    LoadingComponent,
    MatIconModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatButtonModule,
    MatSnackBarModule,
    MatMenuModule,
    MatSidenavModule,
    MatListModule,
    MatBadgeModule,
    MatFormFieldModule,
    MatExpansionModule,
    CarPedidoComponent,
  ],
})
export class AppComponent implements OnInit {
  @Output() noShowLoading = new EventEmitter<boolean>();
  toUpdate: boolean;

  @ViewChild("sidenav") sidenav: MatSidenav;
  isExpanded = true;
  showSubmenu: boolean = false;
  isShowing = false;
  showSubSubMenu: boolean = false;
  @ViewChild(MatAccordion) accordion: MatAccordion;
  title = "Ventas";

  badgevisible = false;
  headerVisible = false;
  badgeCounter = 0;
  isLoading = true;

  private ngZone = inject(NgZone);
  opened: boolean = false;

  ngAfterViewInit() {}

  constructor(
    private router: Router,
    private cookie: CookieService,
    private toastr: ToastrService,
    private serLocal: LocalService,
    private socketService: SocketServiceService,
    private service: ApiService,
    private dService:DomainServiceService
  ) {
    
    const ngZone = ɵglobal.Zone;
    if (this.cookie.get("token")) {
      // this.headerVisible = true;
    }

  }

  ngOnChanges(changes: SimpleChanges): void {
    let count: [] = this.serLocal.getItem("pedido");
    this.badgeCounter = count != undefined ? count.length : 0;
  }
  disabledLoading() {
    this.noShowLoading.emit(false);
  }
  ngOnInit(): void {
    
    if(this.router.url===('/') )return;
    if (this.cookie.get("token")) {
      this.headerVisible = true;
      let count: [] = this.serLocal.getItem("pedido");
      this.badgeCounter = count != undefined ? count.length : 0;
      this.socketService.connect();
      this.socketService.listenPedidos().subscribe((val) => {
        this.badgeCounter = val;
      });
    }
  }
  badgevisibility() {
    this.badgevisible = true;
    // this.socketService.test()
  }
  CloseModel() {
    const modelDiv = document.getElementById("myModalPedido");
    if (modelDiv != null) {
      modelDiv.style.display = "none";
    }
  }
  confirmar() {
    let pedido = this.serLocal.getItem("pedido");
    this.service
      .createPedido(pedido)
      .pipe(take(1))
      .subscribe(
        (resp) => {
          if (resp["type"] == "ok") {
            this.toastr.success("Pedido enviado");
            this.socketService.test(0);
            this.CloseModel();
            this.serLocal.removeItem("pedido");
          }
        },
        (error) => {
          this.toastr.error(error["statusText"], "Error");
        },
      );
  }
  openModel() {
    const modelDiv = document.getElementById("myModalPedido");
    if (modelDiv != null) {
      modelDiv.style.display = "block";
    }
  }
  cancelarUpdate() {
    this.toUpdate = false;
  }
  mouseenter() {
    if (!this.isExpanded) {
      this.isShowing = true;
    }
  }

  mouseleave() {
    if (!this.isExpanded) {
      this.isShowing = false;
    }
  }
  logout() {
    this.cookie.deleteAll();
    this.serLocal.clear();
    this.router.navigate(["/login"]);
    this.headerVisible = false;
    this.opened = false;
  }
  onOutletLoaded(component: DashboardComponent) {
    
    
    if(this.router.url===('/login' || '/') )return;
    if (this.cookie.get("token")) {
      this.headerVisible = true;
      let count: [] = this.serLocal.getItem("pedido");
      this.badgeCounter = count != undefined ? count.length : 0;
      this.socketService.connect();
      this.socketService.listenPedidos().subscribe((val) => {
        this.badgeCounter = val;
      });
    }
    // component.someProperty = 'someValue';
}
}
