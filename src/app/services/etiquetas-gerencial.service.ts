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
  
  getSingleEtiquetas(id: number) {
    return this.http.get(`https://app-etiquetas.herokuapp.com/api/carts-types/${id}`);
  }

  createEmbalagem(name: any){
    return this.http.post('https://app-etiquetas.herokuapp.com/api/carts-types', name);
  }

  updateEmbalagens(id: number, name: any){
    return this.http.patch(`https://app-etiquetas.herokuapp.com/api/carts-types/${id}`, name);
  }

  deleteEmbalagem(id: number) {
    return this.http.delete(`https://app-etiquetas.herokuapp.com/api/carts-types/${id}`);
  }
}
