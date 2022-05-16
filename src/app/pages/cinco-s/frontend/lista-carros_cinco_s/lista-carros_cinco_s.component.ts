import { Component, OnInit } from '@angular/core';
import { SessionService } from 'src/app/shared/session.service';
import { ListaCarrosCincoSService } from '../../backend/services/lista-carros_cinco_s.service';

@Component({
  selector: 'app-lista-carros_cinco_s',
  templateUrl: './lista-carros_cinco_s.component.html',
  styleUrls: ['./lista-carros_cinco_s.component.css']
})
export class ListaCarrosCincoSComponent implements OnInit {
  filterEmbalagem: string = '';
  listaCarros: any[] = [];
  listaCarrosManutencao: any[] = [];

  // ngx-pagination
  itemsPerPage: any = 14;
  currentPage: number = 1;
  totalRecords!: number;

  constructor(
    private listaCarrosService: ListaCarrosCincoSService,
    private sessionService: SessionService,
    ) { }

  ngOnInit(): void {
    // valerá somente se existir sessao
    if(this.sessionService.getItemPerPageListaEmbalagem()) {
      this.itemsPerPage = this.sessionService.getItemPerPageListaEmbalagem();
    }

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
            this.totalRecords = this.listaCarros.length;
          });
        });
      });
    });
  }

  // salvando valor setado pelo usuario de numero de itens por pagina
  saveNumberOfItemssPerPage(num: number): void {
    this.sessionService.setItemPerPageListaEmbalagem(num);
  }
}
