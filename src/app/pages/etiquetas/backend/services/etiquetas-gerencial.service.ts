import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EtiquetasGerencialService {

  constructor(private http: HttpClient) { }

  getEtiquetas() {
    return this.http.get(`${environment.server}/api/carts`);
  }
  
  getSingleEtiquetas(id: number) {
    return this.http.get(`${environment.server}/api/carts-types/${id}`);
  }

  inactivateEtiqueta(id: number, status: any) {
    return this.http.patch(`${environment.server}/api/carts/${id}`, status);
  }

  createEmbalagem(name: any){
    return this.http.post(`${environment.server}/api/carts-types`, name);
  }

  updateEmbalagens(id: number, name: any){
    return this.http.patch(`${environment.server}/api/carts-types/${id}`, name);
  }

  deleteEmbalagem(id: number) {
    return this.http.delete(`${environment.server}/api/carts-types/${id}`);
  }

  getAllMaintenances() {
    return this.http.get(`${environment.server}/api/maintenances?finishedAt=null`);
  }
  
  finishMaintenance(id: number, finishedAt: any) {
    return this.http.patch(`${environment.server}/api/maintenances/${id}`, finishedAt);
  }
}
