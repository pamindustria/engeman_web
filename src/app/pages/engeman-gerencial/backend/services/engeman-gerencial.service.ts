import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

const API_URL = 'http://localhost:8000/api'

@Injectable({ providedIn: 'root' })
export class EngemanGerencialService {

  constructor(private http: HttpClient) { }

  getEngemanList() {
    return this.http.get(`${API_URL}/getOS`);
  }
}
