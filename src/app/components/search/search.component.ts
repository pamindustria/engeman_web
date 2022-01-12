import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from "@angular/core";
import { MatDatepickerInputEvent } from "@angular/material/datepicker";
import { Subject } from "rxjs";
import { debounceTime, filter } from 'rxjs/operators';

@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.css']

})
export class SearchComponent implements OnInit, OnDestroy{
  debounce: Subject<string> = new Subject<string>();
  @Output() onTyping = new EventEmitter<string>();
  @Input() value: string = '';
  @Input() placeholderString:string = "";

  //debounce serve para que identificar quando o usuario termina de digitar
  //e uma funcao é ativada depois de certo tempo, aqui é depois de 300milisegundos
  ngOnInit() {
    this.debounce.pipe(debounceTime(300)).subscribe((filter ) => {
      this.onTyping.emit(filter)
    });
  }

  ngOnDestroy(): void {
    this.debounce.unsubscribe();
  }
}