import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from "@angular/core";
import { MatDatepickerInputEvent } from "@angular/material/datepicker";
import { Subject } from "rxjs";
import { debounceTime, filter } from 'rxjs/operators';

@Component({
    selector: 'app-date-filter',
    templateUrl: './dateFilter.component.html',
    styleUrls: ['./dateFilter.component.css']

})
export class DateFilterComponent implements OnInit, OnDestroy{
  debounce: Subject<string> = new Subject<string>();
  @Output() onTyping = new EventEmitter<string>();
  @Input() value: string = '';

  //debounce serve para que identificar quando o usuario termina de digitar
  //e uma funcao é ativada depois de certo tempo, aqui é depois de 300milisegundos
  ngOnInit() {
    this.debounce.pipe(debounceTime(300)).subscribe((filter ) => {
      this.onTyping.emit(filter)
      console.log(filter);
      
    });
  }

  ngOnDestroy(): void {
    this.debounce.unsubscribe();
  }
}