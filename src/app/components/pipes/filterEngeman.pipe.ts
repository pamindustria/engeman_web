import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterEngeman'
})
export class FilterEngemanPipe implements PipeTransform {

   transform(value: any, searchValue: string): any {
      if (!searchValue) return value;
      return value.filter((v: any) =>  v.os.toLowerCase().indexOf(searchValue.toLowerCase()) > -1 || 
      v.funcionarios.toLowerCase().indexOf(searchValue.toLowerCase()) > -1 || 
      v.matricula.toLowerCase().indexOf(searchValue.toLowerCase()) > -1 ||
      v.dataInicio.toLowerCase().indexOf(searchValue.toLowerCase()) > -1 ||
      v.dataFim.toLowerCase().indexOf(searchValue.toLowerCase()) > -1)
   }
}