import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL_HEROKU } from 'src/app/util/server';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ListaCarrosService {

  constructor(private http: HttpClient) { }

  getListaCarros() {
    return this.http.get(`${API_URL_HEROKU}/api/carts-types`);
  }

  getListaCarrosManutencao() {
    return this.http.get(`${API_URL_HEROKU}/api/maintenances?finishedAt=null`);
  }
  
  getListaCarrosInativos() {
    return this.http.get(`${API_URL_HEROKU}/api/carts?status=INACTIVE`);
  }
}
