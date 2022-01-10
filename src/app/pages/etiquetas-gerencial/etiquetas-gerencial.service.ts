import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EtiquetasGerencialService {

  constructor(private http: HttpClient) { }

  getEtiquetas() {
    return this.http.get('https://app-etiquetas.herokuapp.com/api/carts');
  }
}
