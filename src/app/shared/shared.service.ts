import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";

@Injectable({providedIn: 'root'})
export class SharedService{
   private method: Subject<any> = new Subject<any>();
   private editMethod: Subject<void> = new Subject<void>();
   private deleteMethod: Subject<void> = new Subject<void>();
   private filtroClienteRelatorioMethod: Subject<any> = new Subject<any>();

   sendMethodEvent(isVazio: boolean): void {      
      this.method.next(isVazio);
   } 

   getMethodEvent(): Observable<any> {
      return this.method.asObservable();
   }

   sendEditEmbalagemEvent(): void {      
      this.editMethod.next();
   } 

   getEditEmbalagemEvent(): Observable<any> {
      return this.editMethod.asObservable();
   }

   sendDeleteEmbalagemEvent(): void {      
      this.deleteMethod.next();
   } 

   getDeleteEmbalagemEvent(): Observable<any> {
      return this.deleteMethod.asObservable();
   }

   sendFiltroClienteRelatorioEvent(valor: String): void {      
      this.filtroClienteRelatorioMethod.next(valor);
   } 

   getFiltroClienteRelatorioEvent(): Observable<any> {
      return this.filtroClienteRelatorioMethod.asObservable();
   }
}