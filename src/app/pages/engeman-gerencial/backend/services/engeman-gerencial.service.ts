import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from 'src/environments/environment';


const API_URL = 'http://10.30.2.253:8000/api'

@Injectable({ providedIn: 'root' })
export class EngemanGerencialService {

  constructor(private http: HttpClient) { }

  getEngemanList() {
    return this.http.get(`${environment.server}/getOS`);
  }
}
