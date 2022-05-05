import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

const API_URL = 'http://localhost:8001/api'

@Injectable({ providedIn: 'root' })
export class DocaListagemService {

   constructor(private http: HttpClient) { }

   getDocaList() {
      return this.http.get(`${API_URL}/getLista`);
   }
}
