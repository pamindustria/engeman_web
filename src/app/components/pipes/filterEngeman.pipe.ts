import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterOS'
})
export class FilterOSPipe implements PipeTransform {

   transform(value: any, searchValue: string): any {
      if (!searchValue) return value;
      return value.filter((v: any) =>  v.OS.toLowerCase().indexOf(searchValue.toLowerCase()) > -1)
   }
}

@Pipe({
   name: 'filterDataIni'
 })
 export class FilterDataIniPipe implements PipeTransform {
 
   transform(value: any, searchValue: string): any {
      if (!searchValue) return value;
      return value.filter((v: any) => v.DataIni.toLowerCase().indexOf(searchValue.toLowerCase()) > -1)
   }
}

@Pipe({
   name: 'filterDataFim'
 })
 export class FilterDataFimPipe implements PipeTransform {
 
   transform(value: any, searchValue: string): any {
      if (!searchValue) return value;
      return value.filter((v: any) => v.DataFim.toLowerCase().indexOf(searchValue.toLowerCase()) > -1)
   }
}

@Pipe({
   name: 'filterFuncionario'
 })
 export class FilterFuncionarioPipe implements PipeTransform {
 
   transform(value: any, searchValue: string): any {
      if (!searchValue) return value;
      return value.filter((v: any) => v.NomeFunc.toLowerCase().indexOf(searchValue.toLowerCase()) > -1)
   }
}

@Pipe({
   name: 'filterMatricula'
 })
 export class FilterMatriculaPipe implements PipeTransform {
 
   transform(value: any, searchValue: string): any {
      if (!searchValue) return value;
      return value.filter((v: any) => v.codfun.toLowerCase().indexOf(searchValue.toLowerCase()) > -1)
   }
}

@Pipe({
   name: 'filterDescricao'
 })
 export class FilterDescricaoPipe implements PipeTransform {
 
   transform(value: any, searchValue: string): any {
      if (!searchValue) return value;
      return value.filter((v: any) => v.Obs.toLowerCase().indexOf(searchValue.toLowerCase()) > -1)
   }
}

@Pipe({
   name: 'filterEquipamento'
 })
 export class FilterEquipamentoDescricaoPipe implements PipeTransform {
 
   transform(value: any, searchValue: string): any {
      if (!searchValue) return value;
      return value.filter((v: any) => v.APLICDescr.toLowerCase().indexOf(searchValue.toLowerCase()) > -1)
   }
}