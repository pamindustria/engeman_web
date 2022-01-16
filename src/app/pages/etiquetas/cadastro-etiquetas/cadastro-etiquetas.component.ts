import { Component, OnInit } from '@angular/core';
import { ListaCarrosService } from 'src/app/services/lista-carros.service';

@Component({
  selector: 'app-cadastro-etiquetas',
  templateUrl: './cadastro-etiquetas.component.html',
  styleUrls: ['./cadastro-etiquetas.component.css']
})
export class CadastroEtiquetasComponent implements OnInit {
  filterEmbalagem: string = '';
  filterEtiqueta: string = '';
  filterManutencao: string = '';

  listaCarros: any[] = [];
  listaEtiquetas: any[] = [
    {code: 'PAM1'},
    {code: 'PAM2'},
    {code: 'PAM3'},
    {code: 'PAM4'},
    {code: 'PAM5'},
  ]

  constructor(private listaCarrosService: ListaCarrosService) { }

  ngOnInit(): void {
    this.listaCarrosService.getListaCarros().subscribe((carros: any) => {
      carros.forEach((carro: any) => {
        this.listaCarros.push(carro);
      });
    })
  }

}
