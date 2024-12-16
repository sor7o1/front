import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CookieService } from "ngx-cookie-service";
import { LocalService } from "../services/local.service";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment.development";
@Injectable({
  providedIn: "root",
})
export class InventarioService {
  // private apiUrl = "https://backend-sales-8ax7.onrender.com/inventario/";
  // private apiUrl = "http://localhost:3000/inventario/";
  private apiUrl = environment.apiUrl;

  public token = this.cookie.get("token");
  httpOptions = {
    headers: new HttpHeaders({
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "x-access-token": this.token,
    }),
  };
  constructor(
    private http: HttpClient,
    private cookie: CookieService,
    private localStorage: LocalService,
  ) {}

  saveInventario(header, data): Observable<any> {
    let url = this.apiUrl+'inventario/' + "createInventario";
    let body = {
      nombre: header["nombre"],
      descripcion: header["descripcion"],
      prods: data,
      idUser: this.localStorage.getItem("idUser"),
      typeInventario: "entrada",
      idCompania: this.localStorage.getItem("idCompania"),
    };
    return this.http.post(url, body, this.httpOptions);
  }
  getInventariosByCompania(): Observable<any> {
    let apiUrl = this.apiUrl+'inventario/' + "getInventarioByCompany";
    let id = this.localStorage.getItem("idCompania");
    return this.http.post(`${apiUrl}/${id}`, { body: null }, this.httpOptions);
  }
  updateInventario(header, detalle): Observable<any> {
    let body = {
      header: header,
      detalle: detalle,
    };
    let apiUrl = this.apiUrl+'inventario/' + "updateInventario";
    return this.http.put(apiUrl, body, this.httpOptions);
  }
  deleteInventario(row) {
    let apiUrl = this.apiUrl + "deleteInventarioById";
    let id = row["header"]["_id"];
    return this.http.delete(`${apiUrl}/${id}`, this.httpOptions);
  }
}
