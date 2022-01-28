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
        // console.log(manutencao);

        this.listaCarrosService.getListaCarrosInativos().subscribe((inativos: any) => {
          // console.log(inativos);

          carros.forEach((tipos: any) => {
            //a cada novo objeto do types faça uma nova contagem de carts com status idle/out
            var idleStatusCount = 0;
            var outStatusCount = 0;
            var maintenanceStatusCount = 0;          
            var inactiveStatusCount = 0;          
            
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
                // console.log(cart.cart.type.name);
                if (tipos.name === cart.cart.type.name) {
                  maintenanceStatusCount++;
                }
              });
            }

            inativos.forEach((inativo: any) => {
              console.log(inativo.type.name);
              if (tipos.name === inativo.type.name) {
                inactiveStatusCount++;
              }
            });
  
            //entao adiciono um novo atributo ao objeto
            tipos.disponivel = idleStatusCount;
            tipos.cliente = outStatusCount;
            tipos.manutencao = maintenanceStatusCount;
            tipos.inativos = inactiveStatusCount;
            this.listaCarros.push(tipos);
          });
        });
      });
    });
  }
}
