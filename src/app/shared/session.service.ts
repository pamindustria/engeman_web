import { Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class SessionService {

   setItemPerPageListaEtiqueta(qtd: any) {
      console.log(qtd);
      window.sessionStorage.setItem('ItemPerPageListaEtiqueta', qtd);
   }

   getItemPerPageListaEtiqueta() {
      return window.sessionStorage.getItem('ItemPerPageListaEtiqueta');
   }

   setItemPerPageListaEmbalagem(qtd: any) {
      window.sessionStorage.setItem('ItemPerPageListaEmbalagem', qtd);
   }

   getItemPerPageListaEmbalagem() {
      return window.sessionStorage.getItem('ItemPerPageListaEmbalagem');
   }
   
   setItemPerPageCadastroEmbalagem(qtd: any) {
      window.sessionStorage.setItem('ItemPerPageCadastroEmbalagem', qtd);
   }

   getItemPerPageCadastroEmbalagem() {
      return window.sessionStorage.getItem('ItemPerPageCadastroEmbalagem');
   }
   
   setItemPerPageCadastroEtiquetas(qtd: any) {
      window.sessionStorage.setItem('ItemPerPageCadastroEtiquetas', qtd);
   }

   getItemPerPageCadastroEtiquetas() {
      return window.sessionStorage.getItem('ItemPerPageCadastroEtiquetas');
   }

   setItemPerPageManutencao(qtd: any) {
      window.sessionStorage.setItem('ItemPerPageManutencao', qtd);
   }

   getItemPerPageManutencao() {
      return window.sessionStorage.getItem('ItemPerPageManutencao');
   }

   setItemPerPageEngeman(qtd: any) {
      window.sessionStorage.setItem('ItemPerPageEngeman', qtd);
   }

   getItemPerPageEngeman() {
      return window.sessionStorage.getItem('ItemPerPageEngeman');
   }
}