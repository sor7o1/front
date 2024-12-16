import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, tap } from "rxjs";
import {
  HttpClient,
  HttpHeaders,
  HttpParams,
  HttpResponse,
} from "@angular/common/http";
import { CookieService } from "ngx-cookie-service";
import { Component, Inject } from "@angular/core";
import { CommonModule, DOCUMENT } from "@angular/common";
import { LocalService } from "../services/local.service";

import { environment } from "../../environments/environment.development";

@Injectable({
  providedIn: "root",
})
export class ApiService {
  public isLoggedInSubject: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);
  isLoggedIn: any = 0;
  reirectUrl: string | null = null;

  private authState = new BehaviorSubject<any | null>(null);
  authState$ = this.authState.asObservable();
  private apiUrl = environment.apiUrl; // Replace with your API endpoint
  // private apiUrl = "http://34.224.221.93:3000/"; // Replace with your API endpoint
  // private apiUrl = "https://backend-sales-8ax7.onrender.com/"; // Replace with your API endpoint
  // private apiUrl = "http://localhost:3000/"; // Replace with your API endpoint
  private urlProducto = this.apiUrl + "producto";
  private urlPedido = this.apiUrl + "pedido";
  public token = this.cookie.get("token");

  httpOptions = {
    headers: new HttpHeaders({
      "Content-Type": "application/x-www-form-urlencoded",
      "Access-Control-Allow-Origin": "*",
      "x-access-token": this.token,
      // 'application/x-www-form-urlencoded'
    }),
  };
  // private _params = {
  //   idUser: localStorage?.getItem("idUser"),
  //   idCompania: localStorage?.getItem("idCompania"),
  // };

  date = new Date();
  private headers = new HttpHeaders()
    .set("content-type", "application/json")
    .set("Access-Control-Allow-Origin", "*")
    .set("x-access-token", this.token);
  constructor(
    private http: HttpClient,
    private cookie: CookieService,
    private lsto: LocalService,
  ) {
    this.token = this.cookie.get("token");
    if (!this.cookie.check("token")) {
      this.cookie.deleteAll();
      this.lsto.removeItem("typeUser");
      this.lsto.removeItem("idUser");
      this.lsto.removeItem("idCompania");
    }
  }

  logOut(): void {
    this.isLoggedIn = false;
  }

  setAuthState(user: any | null) {
    this.authState.next(user);
  }
  // Peticiones de usuarios
  login(username, password): Observable<any> {
    console.log(this.apiUrl)
    return this.http.post<any>(`${this.apiUrl}user/login`, {
      username: username,
      password: password,
    });
  }

  // CRUD DE ROLES

  addRole(data) {
    const url = `${this.apiUrl}user/addRole`;
    return this.http.post(url, data, this.httpOptions);
  }
  updateRole(data) {
    const url = `${this.apiUrl}user/updateRole`;
    return this.http.post(url, data, this.httpOptions);
  }
  deleteRole(data) {
    const url = `${this.apiUrl}user/deleteRole`;
    return this.http.post(url, data, this.httpOptions);
  }
  getRoles() {
    return this.http.get<any>(`${this.apiUrl}user/getRoles`, this.httpOptions);
  }

  // Peticiones de companias
  getCompanias(): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}compania/getCompanias`,
      { body: null },
      this.httpOptions,
    );
  }

  createCompania(data) {
    return this.http.post(
      this.apiUrl + "compania/createCompania",
      data,
      this.httpOptions,
    );
  }
  updateCompania(data) {
    return this.http.post(
      this.apiUrl + "compania/updateCompania",
      data,
      this.httpOptions,
    );
  }
  deleteCompania(data) {
    return this.http.post(
      this.apiUrl + "compania/deleteCompania",
      data,
      this.httpOptions,
    );
  }

  // PETICIONES CRUD USUARIOS POR COMPANIA
  getUserByCompania(_idCompania): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}compania/getUserByCompania`,
      JSON.stringify({ _id: _idCompania }),
      this.httpOptions,
    );
  }

  addUsuario(data) {
    return this.http.post(
      this.apiUrl + "user/createUser",
      data,
      this.httpOptions,
    );
  }
  updateUsuario(data) {
    return this.http.post(
      this.apiUrl + "user/updateUser",
      data,
      this.httpOptions,
    );
  }
  deleteUsuario(data) {
    return this.http.post(
      this.apiUrl + "user/deleteUser",
      data,
      this.httpOptions,
    );
  }

  //
  addProducto(data) {
    let idUser = this.lsto.getItem("idUser");
    let idCompania = this.lsto.getItem("idCompania");
    data.idUser = idUser;
    data.idCompania = idCompania;

    return this.http.post(
      this.urlProducto + "/addProducto",
      data,
      this.httpOptions,
    );
  }
  getProductoByCompania(data): Observable<any> {
    let idCompania = this.lsto.getItem("idCompania");
    data["id"] = idCompania;
    let url = this.urlProducto + "/getProductoByCompania";
    return this.http.post<any>(url, data, this.httpOptions);
  }
  getProducts(): Observable<any> {
    let url = this.urlProducto + "/getProductos";

    return this.http.get<any>(url, this.httpOptions);
  }

  deleteProducto(data): Observable<any> {
    let url = this.urlProducto + "/deleteProducto";
    return this.http.post(url, data, this.httpOptions);
  }

  updateProducto(data): Observable<any> {
    let url = this.urlProducto + "/updateProducto";
    return this.http.post(url, data, this.httpOptions);
  }

  //CRUD PEDIDOS
  createPedido(data) {
    let body = {
      idUsuario: this.lsto.getItem("idUser"),
      idCompania: this.lsto.getItem("idCompania"),
      data: data,
    };

    return this.http.post(
      this.urlPedido + "/addPedido",
      body,
      this.httpOptions,
    );
  }
  getPedidosByUser(): Observable<any> {
    let id = this.lsto.getItem("idUser");
    let data = { id: id };
    return this.http.post<any>(
      this.urlPedido + "/getPedidosByUser",
      data,
      this.httpOptions,
    );
  }
  getPedidosByCompania(): Observable<any> {
    let id = this.lsto.getItem("idCompania");
    let data = { id: id };

    return this.http.post(
      this.urlPedido + "/getPedidosByCompania",
      data,
      this.httpOptions,
    );
  }
  updatePedido(data): Observable<any> {
    return this.http.post(
      this.urlPedido + "/updatePedido",
      data,
      this.httpOptions,
    );
  }
  updatePedidoEstado(data): Observable<any> {
    return this.http.post(
      this.urlPedido + "/updatePedidoEstado",
      data,
      this.httpOptions,
    );
  }
  delete(data): Observable<any> {
    return this.http.post(
      this.urlPedido + "/deletePedido",
      data,
      this.httpOptions,
    );
  }
}
