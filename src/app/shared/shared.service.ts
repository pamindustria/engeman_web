import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";

@Injectable({providedIn: 'root'})
export class SharedService{
   private method: Subject<any> = new Subject<any>();

   sendMethodEvent(isVazio: boolean): void {      
      this.method.next(isVazio);
   } 

   getMethodEvent(): Observable<any> {
      return this.method.asObservable();
   }
}