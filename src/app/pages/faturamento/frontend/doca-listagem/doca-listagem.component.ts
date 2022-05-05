import { Component, OnInit } from '@angular/core';
import { DocaListagemService } from './doca-listagem.service';

@Component({
  selector: 'app-doca-listagem',
  templateUrl: './doca-listagem.component.html',
  styleUrls: ['./doca-listagem.component.css']
})
export class DocaListagemComponent implements OnInit {
  docaLista: any = []

  constructor(
    private docaListagemService: DocaListagemService
  ) { }

  ngOnInit(): void {
    this.docaListagemService.getDocaList().subscribe((lista: any) => {
      lista.forEach((item: any) => {
        this.docaLista.push(item);
      });
      console.log(this.docaLista);
    });
  }

}
