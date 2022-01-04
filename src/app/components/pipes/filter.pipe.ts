import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterByCliente'
})
export class FilterPipe implements PipeTransform {

   transform(value: any, searchValue: string): any {
      if (!searchValue) return value;
      return value.filter((v: any) => v.cliente.toLowerCase().indexOf(searchValue.toLowerCase()) > -1 ||
      v.etiqueta.toLowerCase().indexOf(searchValue.toLowerCase()) > -1 ||
      v.dataUltimaSaida.toLowerCase().indexOf(searchValue.toLowerCase()) > -1 ||
      v.dataUltimoRetorno.toLowerCase().indexOf(searchValue.toLowerCase()) > -1)
   }

}