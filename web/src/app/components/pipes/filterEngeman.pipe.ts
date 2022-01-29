import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterEngeman'
})
export class FilterEngemanPipe implements PipeTransform {

   transform(value: any, searchValue: string): any {
      if (!searchValue) return value;
      return value.filter((v: any) =>  v.OS.toLowerCase().indexOf(searchValue.toLowerCase()) > -1 || 
      v.NomeFunc.toLowerCase().indexOf(searchValue.toLowerCase()) > -1 || 
      v.codfun.toLowerCase().indexOf(searchValue.toLowerCase()) > -1 ||
      v.DataIni.toLowerCase().indexOf(searchValue.toLowerCase()) > -1)
      // v.DataFim.toLowerCase().indexOf(searchValue.toLowerCase()) > -1)
   }
}