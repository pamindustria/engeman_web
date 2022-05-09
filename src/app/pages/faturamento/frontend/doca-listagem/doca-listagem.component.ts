import { Component, OnInit } from '@angular/core';
import { DocaListagemService } from './doca-listagem.service';

@Component({
  selector: 'app-doca-listagem',
  templateUrl: './doca-listagem.component.html',
  styleUrls: ['./doca-listagem.component.css']
})
export class DocaListagemComponent implements OnInit {
  docaListaFiltrada: any = [];
  docaListaCompleta: any = [];
  docaNFs: any = [];
  listaProdutosNota: any = [];
  notaSelecionada: String = "";
  docaSelecionada: boolean = false;
  docaId: number = -1;
  liberarEmbarque: number = 0; //0 - concluido; 1 - embarcando; 2 - embarcado
  dateInstance: Date = new Date()
  time: Date | undefined;
  date = this.dateInstance.toLocaleDateString("pt-BR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  filterNota: string = '';

  
  constructor(
    private docaListagemService: DocaListagemService,
    
    ) {
    setInterval(() => {
      this.time = new Date();
      this.date = this.dateInstance.toLocaleDateString("pt-BR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
    }, 1000)
  }

  ngOnInit(): void {
    this.docaListagemService.getDocaList().subscribe((lista: any) => {
      lista.forEach((item: any) => {
        this.docaListaCompleta.push(item);
        
        if (!this.docaNFs.includes(item.NF)) {
          this.docaNFs.push(item.NF);
          this.docaListaFiltrada.push(item);
        }
      });
      console.log(this.docaListaCompleta);
    });
  }

  selecionaDoca(id: number) {
    this.docaId = id;
  }

  embarqueLiberado(valor: number) {
    this.liberarEmbarque = valor;
    setTimeout(() => {
      this.liberarEmbarque = 2;
    }, 2000);
  }

  getProdutosDaNotaFiscaL(nota: String) {
    this.notaSelecionada = nota;
    this.docaListaCompleta.forEach((doca: any) => {
      if (doca.NF === nota) {
        this.listaProdutosNota.push(doca);
        console.log(doca);
      }
    });
  }
}
