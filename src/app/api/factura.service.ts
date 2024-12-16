import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import {
  HttpClient,
  HttpHeaders,
  HttpParams,
  HttpResponse,
} from "@angular/common/http";
import { CookieService } from "ngx-cookie-service";
import { LocalService } from "../services/local.service";
import { environment } from "../../environments/environment.development";
@Injectable({
  providedIn: "root",
})
export class FacturaService {
  private apiUrl = environment.apiUrl;
  private apiUrlImp = this.apiUrl+"impuesto/";
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

  //crud de facturas
  getFacturasByCompany(): Observable<any> {
    let apiUrl = this.apiUrl + "getFacturaByCompania";
    let id = this.localStorage.getItem("idCompania");
    return this.http.post(`${apiUrl}/${id}`, { id: id }, this.httpOptions);
  }
  getFacturasByPedido(_id): Observable<any> {
    let apiUrl = this.apiUrl + "getFacturaByCompania";
    let id = this.localStorage.getItem("idCompania");
    return this.http.post(`${apiUrl}/${_id}`, { id: _id }, this.httpOptions);
  }

  updateFacturasByCompania(id): Observable<any> {
    let apiUrl = this.apiUrl + "deleteFacturaById";

    return this.http.post(
      `${apiUrl}/${id}`,
      { data: "toUpdate" },
      this.httpOptions,
    );
  }

  saveFactura(data): Observable<any> {
    let apiUrl = this.apiUrl + "saveFactura";
    data["idCompania"] = this.localStorage.getItem("idCompania");
    data["idUser"] = this.localStorage.getItem("idUser");
    return this.http.post(apiUrl, data, this.httpOptions);
  }

  getAll(): Observable<any> {
    return this.http.get(this.apiUrl);
  }
  //crud punto de emision
  getById(id: string): Observable<any> {
    let apiUrl = this.apiUrl + "getPuntosEmisionByCompania";
    return this.http.post(`${apiUrl}/${id}`, { id: id }, this.httpOptions);
  }

  create(data: any): Observable<any> {
    let apiUrl = this.apiUrl + "createPuntoEmision";
    data["idCompania"] = this.localStorage.getItem("idCompania");


    return this.http.post(apiUrl, data, this.httpOptions);
  }

  update(id: string, data: any): Observable<any> {
    let apiUrl = this.apiUrl + "updatePuntoEmisionById";


    return this.http.put(`${apiUrl}/${id}`, data, this.httpOptions);
  }

  delete(id: string): Observable<any> {
    let apiUrl = this.apiUrl + "deletePuntoEmisionById";
    return this.http.delete(`${apiUrl}/${id}`, this.httpOptions);
  }

  // crud Establecimiento
  getEstablecimientoById(id: string): Observable<any> {
    let apiUrl = this.apiUrl + "getEstablecimientoByCompania";
    return this.http.post(`${apiUrl}/${id}`, { id: id }, this.httpOptions);
  }

  createEstablecimiento(data: any): Observable<any> {
    let apiUrl = this.apiUrl + "createEstablecimiento";
    data["idCompania"] = this.localStorage.getItem("idCompania");


    return this.http.post(apiUrl, data, this.httpOptions);
  }

  updatEstablecimiento(id: string, data: any): Observable<any> {
    let apiUrl = this.apiUrl + "updateEstablecimientoById";


    return this.http.put(`${apiUrl}/${id}`, data, this.httpOptions);
  }

  deleteEstablecimiento(id: string): Observable<any> {
    let apiUrl = this.apiUrl + "deleteEstablecimientoById";
    return this.http.delete(`${apiUrl}/${id}`, this.httpOptions);
  }

  //crud Tipos de documento
  getTiposDocumentosById(id: string): Observable<any> {
    let apiUrl = this.apiUrl + "getTipoDocumentoByCompania";
    return this.http.post(`${apiUrl}/${id}`, { id: id }, this.httpOptions);
  }

  createTipoDocumento(data: any): Observable<any> {
    let apiUrl = this.apiUrl + "createTipoDocumento";
    data["idCompania"] = this.localStorage.getItem("idCompania");

    return this.http.post(apiUrl, data, this.httpOptions);
  }

  updateTipoDocumento(id: string, data: any): Observable<any> {
    let apiUrl = this.apiUrl + "updateTipoDocumentoById";


    return this.http.put(`${apiUrl}/${id}`, data, this.httpOptions);
  }

  deleteTipoDocumento(id: string): Observable<any> {
    let apiUrl = this.apiUrl + "deleteTipoDocumentoById";
    return this.http.delete(`${apiUrl}/${id}`, this.httpOptions);
  }
  //crud Tipos de documento
  getCaiById(id: string): Observable<any> {
    let apiUrl = this.apiUrl + "getCaiByCompania";
    return this.http.post(`${apiUrl}/${id}`, { id: id }, this.httpOptions);
  }

  createCai(data: any): Observable<any> {
    let apiUrl = this.apiUrl + "createCai";
    data["idCompania"] = this.localStorage.getItem("idCompania");


    return this.http.post(apiUrl, data, this.httpOptions);
  }

  updateCai(id: string, data: any): Observable<any> {
    let apiUrl = this.apiUrl + "updateCaiById";


    return this.http.put(`${apiUrl}/${id}`, data, this.httpOptions);
  }

  deleteCai(id: string): Observable<any> {
    let apiUrl = this.apiUrl + "deleteCaiById";
    return this.http.delete(`${apiUrl}/${id}`, this.httpOptions);
  }

  // CRUD PARA IMPUESTOS

  createImpuesto(data: any): Observable<any> {
    let url = this.apiUrlImp + "createImpuesto";
    return this.http.post(url, data, this.httpOptions);
  }

  getImpuestos(): Observable<any> {
    let url = this.apiUrlImp + "getImpuestos";

    return this.http.post(url, { getImp: true }, this.httpOptions);
  }
  updateImpuesto(id: string, data: any): Observable<any> {
    let apiUrl = this.apiUrlImp + "updateImpuestoById";


    return this.http.put(`${apiUrl}/${id}`, data, this.httpOptions);
  }

  deleteImpuesto(id: string): Observable<any> {
    let apiUrl = this.apiUrlImp + "deleteImpuestoById";
    return this.http.delete(`${apiUrl}/${id}`, this.httpOptions);
  }
}
