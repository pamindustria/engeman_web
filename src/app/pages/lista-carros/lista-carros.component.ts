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
  listaCarrosManutencao: any[] = [];

  constructor(private listaCarrosService: ListaCarrosService) { }

  ngOnInit(): void {
    this.listaCarrosService.getListaCarros().subscribe((carros: any) => {
      //buscando lista de carros em manutenção
      this.listaCarrosService.getListaCarrosManutencao().subscribe((manutencao: any) => {
        console.log(manutencao);    

        carros.forEach((tipos: any) => {
          //a cada novo objeto do types faça uma nova contagem de carts com status idle/out
          var idleStatusCount = 0;
          var outStatusCount = 0;
          var maintenanceStatusCount = 0;          
          
          tipos.carts.forEach((carts: any) => {
            // se carro status idle/out, adiciono mais um
            if (carts.status === 'IDLE') {
              idleStatusCount++;
            } else if(carts.status === 'OUT') {
              outStatusCount++;
            }
          });
          
          //igualando os tipos de carro em manutenção pelo seu com id do tipo
          //e adicionando um novo atributo a cada tipo
          if (manutencao.length !== 0) {
            manutencao.forEach((cart: any) => {
              if (tipos.id === cart.id) {
                maintenanceStatusCount++;
              }
            });
          }

          //entao adiciono um novo atributo ao objeto
          tipos.disponivel = idleStatusCount;
          tipos.cliente = outStatusCount;
          tipos.manutencao = maintenanceStatusCount;
          this.listaCarros.push(tipos);
        });     
      });
    });
  }
}
