import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterByCliente'
})
export class FilterPipe implements PipeTransform {

   transform(value: any, searchValue: string): any {
      if (!searchValue) return value;
      return value.filter((v: any) => v.code.toLowerCase().indexOf(searchValue.toLowerCase()) > -1 ||
      v.cartIssues[0].client.name.toLowerCase().indexOf(searchValue.toLowerCase()) > -1 ||
      v.cartIssues[0].readAt.toLowerCase().indexOf(searchValue.toLowerCase()) > -1 ||
      v.cartIssues[0].cartReturnal?.readAt.toLowerCase().indexOf(searchValue.toLowerCase()) > -1);
   }

}