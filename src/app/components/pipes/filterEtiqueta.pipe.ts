import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterByEtiqueta'
})
export class FilterEtiquetaPipe implements PipeTransform {

   transform(value: any, searchValue: string): any {
      if (!searchValue) return value;
      return value.filter((v: any) => v.code.toLowerCase().indexOf(searchValue.toLowerCase()) > -1);
   }

}

@Pipe({
   name: 'filterByCliente'
 })
 export class FilterClientePipe implements PipeTransform {
 
   transform(value: any, searchValue: string): any {
      if (!searchValue) return value;
      return value.filter((v: any) => v.cartIssues[0].client.name.toLowerCase().indexOf(searchValue.toLowerCase()) > -1);
   }
 
}

@Pipe({
   name: 'filterByStatus'
 })
 export class FilterStatusPipe implements PipeTransform {
 
   transform(value: any, searchValue: string): any {
      if (!searchValue) return value;
      return value.filter((v: any) => v.status.toLowerCase().indexOf(searchValue.toLowerCase()) > -1);
   }
 
}

@Pipe({
   name: 'filterByDataSaida'
 })
 export class FilterDataSaidaPipe implements PipeTransform {
 
   transform(value: any, searchValue: string): any {
      if (!searchValue) return value;
      return value.filter((v: any) => v.cartIssues[0].readAt.toLowerCase().indexOf(searchValue.toLowerCase()) > -1);
   }
 
}

@Pipe({
   name: 'filterByDataRetorno'
 })
 export class FilterDataRetornoPipe implements PipeTransform {
 
   transform(value: any, searchValue: string): any {
      if (!searchValue) return value;
      return value.filter((v: any) => v.cartIssues[0].cartReturnal?.readAt.toLowerCase().indexOf(searchValue.toLowerCase()) > -1);
   }
 
}