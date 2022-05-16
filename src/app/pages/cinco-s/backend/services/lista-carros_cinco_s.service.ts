import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ListaCarrosCincoSService {

  constructor(private http: HttpClient) { }

  getListaCarros() {
    return this.http.get(`${environment.server}/api/carts-types`);
  }

  getListaCarrosManutencao() {
    return this.http.get(`${environment.server}/api/maintenances?finishedAt=null`);
  }
  
  getListaCarrosInativos() {
    return this.http.get(`${environment.server}/api/carts?status=INACTIVE`);
  }
}
