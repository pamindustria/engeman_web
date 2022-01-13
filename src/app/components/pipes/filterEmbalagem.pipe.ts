import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterEmbalagem'
})
export class FilterEmbalagemPipe implements PipeTransform {

   transform(value: any, searchValue: string): any {
      if (!searchValue) return value;
      return value.filter((v: any) =>  v.name.toLowerCase().indexOf(searchValue.toLowerCase()) > -1)
   }
}