import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ListaCarrosService {

  constructor(private http: HttpClient) { }

  getListaCarros() {
    return this.http.get('https://app-etiquetas.herokuapp.com/api/carts-types');
  }

  getListaCarrosManutencao() {
    return this.http.get('https://app-etiquetas.herokuapp.com/api/maintenances?finishedAt=null');
  }
  
  getListaCarrosInativos() {
    return this.http.get('https://app-etiquetas.herokuapp.com/api/carts?status=INACTIVE');
  }
}
