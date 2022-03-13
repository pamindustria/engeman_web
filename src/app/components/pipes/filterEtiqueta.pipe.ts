import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import { Subscription } from 'rxjs';
import { SharedService } from 'src/app/shared/shared.service';

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

@Pipe({
   name: 'filterTipoEmbalagem'
 })
 export class FilterTipoEmbalagemPipe implements PipeTransform {
 
   transform(value: any, searchValue: string): any {
      if (!searchValue) return value;
      return value.filter((v: any) => v.type.name.toLowerCase().indexOf(searchValue.toLowerCase()) > -1);
   }
 
}

@Pipe({
   name: 'filterManutencao'
 })
 export class FilterManutencaoPipe implements PipeTransform {
 
   transform(value: any, searchValue: string): any {
      if (!searchValue) return value;
      return value.filter((v: any) => v.cart.type.name.toLowerCase().indexOf(searchValue.toLowerCase()) > -1);
   }
 
}

// FILTROS TELA RELATORIO
@Pipe({
   name: 'relatorioCliente'
 })
 export class RelatorioClientePipe implements PipeTransform {
   // * ao filtrar o cliente na tabela tambem devo filtrar o grafico
   constructor(private sharedService: SharedService) { }
 
   transform(value: any, searchValue: string): any {
      if (!searchValue) {
         // * se vazio, retorno o primeiro nome da lista e passo para o evento
         if (value.length !== 0) {
            console.log(value[0].nome);
            this.sharedService.sendFiltroClienteRelatorioEvent(value[0].nome);
         }
         
         return value;
      };

      // * se nao vazio, passo o primeiro nome da lista filtrada
      var filtro = value.filter((v: any) => v.nome.toLowerCase().indexOf(searchValue.toLowerCase()) > -1);
      this.sharedService.sendFiltroClienteRelatorioEvent(filtro[0].nome);
      
      return value.filter((v: any) => v.nome.toLowerCase().indexOf(searchValue.toLowerCase()) > -1);
   } 
}

@Pipe({
   name: 'relatorioEmabalagem'
 })
 export class RelatorioEmabalagemPipe implements PipeTransform {
 
   transform(value: any, searchValue: string): any {
      if (!searchValue) return value;
      return value.filter((v: any) => v.embalagem.toLowerCase().indexOf(searchValue.toLowerCase()) > -1);
   }
 
}

@Pipe({
   name: 'relatorioFilterTotal'
 })
 export class RelatorioFiltroTotalPipe implements PipeTransform {
 
   transform(value: any, searchValue: string): any {
      if (!searchValue) return value;
      return value.filter((v: any) => v.total = searchValue);
   }
 
}

@Pipe({
   name: 'relatorioFilterByDataSaida'
 })
 export class RelatorioFilterByDataSaidaPipe implements PipeTransform {
   // filtro por range de data
   constructor(public datepipe: DatePipe) {}
 
   transform(value: any, startDate: any, endDate: any): any {
      if(!startDate || !endDate){         
         return value;
     
      } else {
         let startDateFormatada = this.datepipe.transform(startDate, 'yyyy-MM-dd');
         let endDateFormatada = this.datepipe.transform(endDate, 'yyyy-MM-dd');
         let dados = value.filter((v:any) => v.data >= startDateFormatada! && v.data <= endDateFormatada!);
         return dados;
      }
   }
 
}