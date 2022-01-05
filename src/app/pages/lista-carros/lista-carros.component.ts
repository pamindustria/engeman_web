import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-lista-carros',
  templateUrl: './lista-carros.component.html',
  styleUrls: ['./lista-carros.component.css']
})
export class ListaCarrosComponent implements OnInit {
  listaCarros = [
    {carros: 'Euros Pqn', disponivel: '2.500', totalFabrica: '8.000', manutencao: ''},
    {carros: 'Euros Pqn EPS', disponivel: '0', totalFabrica: '', manutencao: ''},
    {carros: 'Eurão Hor', disponivel: '169', totalFabrica: '250', manutencao: ''},
    {carros: 'Eurão Ver', disponivel: '121', totalFabrica: '250', manutencao: ''},
    {carros: 'Gaiolas Grd', disponivel: '23', totalFabrica: '250', manutencao: ''},
    {carros: 'Gaiolas Pqn', disponivel: '121', totalFabrica: '250', manutencao: ''},
    {carros: 'Carros (Fan)', disponivel: '35', totalFabrica: '150', manutencao: ''},
    {carros: 'Carros Seda 75 (Frontal)', disponivel: '15', totalFabrica: '35', manutencao: ''},
    {carros: 'Carros LG (Tampa)', disponivel: '40', totalFabrica: '100', manutencao: ''},
    {carros: 'Carros LG Arcon (Novo)', disponivel: '0', totalFabrica: '40', manutencao: ''},
    {carros: 'Carros LG Arcon (Antigo)', disponivel: '25', totalFabrica: '90', manutencao: ''},
    {carros: 'Carros (Honda)', disponivel: '60', totalFabrica: '160', manutencao: ''},
    {carros: 'Carros (Masa)', disponivel: '10', totalFabrica: '100', manutencao: ''},
    {carros: 'Carros WPool (Porta/C-Porta)', disponivel: '36', totalFabrica: '', manutencao: ''},
    {carros: 'Carros WPpool (Axial)', disponivel: '21', totalFabrica: '', manutencao: ''},
    {carros: 'Caixas Vai-Vem Daikin', disponivel: '6', totalFabrica: '', manutencao: ''},
    {carros: 'Caixa Seda 50"/55"/58"', disponivel: '1.900', totalFabrica: '', manutencao: ''},
    {carros: 'Caixas Seda 75"', disponivel: '2.205', totalFabrica: '', manutencao: ''},
    {carros: 'Caixas LG', disponivel: '200', totalFabrica: '', manutencao: ''},
    {carros: 'Monoblocos Antigos PAM', disponivel: '1.801', totalFabrica: '12.000', manutencao: ''},
    {carros: 'Pallets', disponivel: '200', totalFabrica: '', manutencao: ''},
    {carros: 'Marfinites PAM', disponivel: '20', totalFabrica: '', manutencao: ''},
    {carros: 'Euros em Mantenção', disponivel: '0', totalFabrica: '', manutencao: ''},
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
