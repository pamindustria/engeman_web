import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";

@Injectable({providedIn: 'root'})
export class SharedService{
   private method: Subject<any> = new Subject<any>();
   private embalagemMethod: Subject<void> = new Subject<void>();

   sendMethodEvent(isVazio: boolean): void {      
      this.method.next(isVazio);
   } 

   getMethodEvent(): Observable<any> {
      return this.method.asObservable();
   }

   sendEditEmbalagemEvent(): void {      
      this.embalagemMethod.next();
   } 

   getEditEmbalagemEvent(): Observable<any> {
      return this.embalagemMethod.asObservable();
   }
}