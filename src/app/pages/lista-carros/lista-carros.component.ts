import { Component, OnInit } from '@angular/core';
import { ListaCarrosService } from 'src/app/services/lista-carros.service';

@Component({
  selector: 'app-lista-carros',
  templateUrl: './lista-carros.component.html',
  styleUrls: ['./lista-carros.component.css']
})
export class ListaCarrosComponent implements OnInit {
  filterEmbalagem: string = '';
  listaCarros: any[] = [];

  constructor(private listaCarrosService: ListaCarrosService) { }

  ngOnInit(): void {
    this.listaCarrosService.getListaCarros().subscribe((carros: any) => {
      carros.forEach((tipos: any) => {
        //a cada novo objeto do types faça uma nova contagem de carts com status idle/out
        var idleStatusCount = 0;
        var outStatusCount = 0;

        tipos.carts.forEach((carts: any) => {
          // se carro status idle/out, adiciono mais um
          if (carts.status === 'IDLE') {
            idleStatusCount++;
          } else if(carts.status === 'OUT') {
            outStatusCount++;
          }
        });
        //entao adiciono um novo atributo ao objeto
        tipos.disponivel = idleStatusCount;
        tipos.cliente = outStatusCount;
        this.listaCarros.push(tipos);
      });
    });
  }

}
