import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterNotaFiscal'
})
export class FilterNotaFiscalPipe implements PipeTransform {

   transform(value: any, searchValue: string): any {
      if (!searchValue) return value;
      return value.filter((v: any) =>  v.NF.toLowerCase().indexOf(searchValue.toLowerCase()) > -1)
   }
}