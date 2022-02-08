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
   
   // setItemPerPageListaEmbalagem(qtd: any) {
   //    window.sessionStorage.setItem('ItemPerPageListaEmbalagem', qtd);
   // }

   // getIdUser() {
   //    return window.sessionStorage.getItem('ItemPerPageListaEmbalagem');
   // }

}