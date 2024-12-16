import { Routes } from "@angular/router";
import { AuthGuard } from "./auth-guard.guard";

export const routes: Routes = [
  { path: "", pathMatch: "full", redirectTo: "dashboard" },
  {
    path: "dashboard",
    loadComponent: () =>
      import("./dashboard/dashboard.component").then(
        (m) => m.DashboardComponent,
      ),
    canActivate: [AuthGuard],
  },
  {
    path: "company",
    loadComponent: () =>
      import("./compania/compania.component").then((m) => m.CompaniaComponent),
    canActivate: [AuthGuard],
  },
  {
    path: "clientes",
    loadComponent: () =>
      import("./clientes/clientes.component").then((m) => m.ClientesComponent),
    canActivate: [AuthGuard],
  },
  {
    path: "productos",
    loadComponent: () =>
      import("./productos/productos.component").then(
        (m) => m.ProductosComponent,
      ),
    canActivate: [AuthGuard],
  },
  {
    path: "pedidos",
    loadComponent: () =>
      import("./pedidos/pedidos.component").then((m) => m.PedidosComponent),
    canActivate: [AuthGuard],
  },
  {
    path: "factura",
    children: [
      {
        path: "",
        redirectTo: "facturas",
        pathMatch: "full",
      },
      {
        path: "establecimientoFactura",
        loadComponent: () =>
          import("./factura/establecimiento/establecimiento.component").then(
            (m) => m.EstablecimientoComponent,
          ),
        canActivate: [AuthGuard],
      },
      {
        path: "tipoFactura",
        loadComponent: () =>
          import("./factura/tipos-factura/tipos-factura.component").then(
            (m) => m.TiposFacturaComponent,
          ),
        canActivate: [AuthGuard],
      },
      {
        path: "puntoemision",
        loadComponent: () =>
          import("./factura/punto-emision/punto-emision.component").then(
            (m) => m.PuntoEmisionComponent,
          ),
        canActivate: [AuthGuard],
      },
      {
        path: "cai",
        loadComponent: () =>
          import("./factura/cai/cai.component").then((m) => m.CaiComponent),
        canActivate: [AuthGuard],
      },
      {
        path: "facturas",
        loadComponent: () =>
          import("./factura/facturas/facturas.component").then(
            (m) => m.FacturasComponent,
          ),
        canActivate: [AuthGuard],
      },
    ],
  },
  {
    path: "impuesto",
    loadComponent: () =>
      import("./impuesto/impuesto.component").then((m) => m.ImpuestoComponent),
    canActivate: [AuthGuard],
  },
  {
    path: "inventario",
    loadComponent: () =>
      import("./inventario/inventario.component").then(
        (m) => m.InventarioComponent,
      ),
    canActivate: [AuthGuard],
  },
  {
    path: "login",
    loadComponent: () =>
      import("./login/login.component").then((m) => m.LoginComponent),
  },
  // {path:'**', redirectTo:'/login'}
];
