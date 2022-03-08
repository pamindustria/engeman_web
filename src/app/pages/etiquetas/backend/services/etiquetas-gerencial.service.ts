import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL_HEROKU } from 'src/app/util/server';


import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EtiquetasGerencialService {

  constructor(private http: HttpClient) { }

  getEtiquetas() {
    return this.http.get(`${API_URL_HEROKU}/api/carts`);
  }
  
  getSingleEtiquetas(id: number) {
    return this.http.get(`${API_URL_HEROKU}/api/carts-types/${id}`);
  }

  inactivateEtiqueta(id: number, status: any) {
    return this.http.patch(`${API_URL_HEROKU}/api/carts/${id}`, status);
  }

  createEmbalagem(name: any){
    return this.http.post(`${API_URL_HEROKU}/api/carts-types`, name);
  }

  updateEmbalagens(id: number, name: any){
    return this.http.patch(`${API_URL_HEROKU}/api/carts-types/${id}`, name);
  }

  deleteEmbalagem(id: number) {
    return this.http.delete(`${API_URL_HEROKU}/api/carts-types/${id}`);
  }

  getAllMaintenances() {
    return this.http.get(`${API_URL_HEROKU}/api/maintenances?finishedAt=null`);
  }
  
  finishMaintenance(id: number, finishedAt: any) {
    return this.http.patch(`${API_URL_HEROKU}/api/maintenances/${id}`, finishedAt);
  }
}
