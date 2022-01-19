import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { EtiquetasGerencialService } from 'src/app/services/etiquetas-gerencial.service';
import { ListaCarrosService } from 'src/app/services/lista-carros.service';

@Component({
  selector: 'app-cadastro-etiquetas',
  templateUrl: './cadastro-etiquetas.component.html',
  styleUrls: ['./cadastro-etiquetas.component.css']
})
export class CadastroEtiquetasComponent implements OnInit {
  filterEmbalagem: string = '';
  filterEtiqueta: string = '';
  filterManutencao: string = '';
  newWasClicked: boolean = false;
  isEditTrueIndex: number = -1;

  embalagensForm!: FormGroup;
  updateEmbalagensForm!: FormGroup;

  listaCarros: any[] = [];
  listaEtiquetas: any[] = [
    {code: 'PAM1'},
    {code: 'PAM2'},
    {code: 'PAM3'},
    {code: 'PAM4'},
    {code: 'PAM5'},
  ]

  constructor(
    private listaCarrosService: ListaCarrosService, 
    private formBuilder: FormBuilder,
    private etiquetasService: EtiquetasGerencialService,) { }

  ngOnInit(): void {
    this.listaCarrosService.getListaCarros().subscribe((carros: any) => {
      
      carros.forEach((carro: any) => {
        this.listaCarros.push(carro);
      });
    })

    this.embalagensForm = this.formBuilder.group({
      name: ['']
    })
    
    this.updateEmbalagensForm = this.formBuilder.group({
      name: ['']
    })
  }

  novaEmbalagem() {
    this.newWasClicked = !this.newWasClicked;
  }

  criarNovo() {
    const name = this.embalagensForm.getRawValue() as any;

    this.etiquetasService.createEmbalagem(name).subscribe(
      data => console.log(`Embalagem criada ${data}`),
      err => console.log('Erro ao criar embalagem')
    )
  }

  deletar(id: number) {    
    this.etiquetasService.deleteEmbalagem(id).subscribe(
      data => console.log(`Embalagem deletada com sucesso: ${data}`),
      err => console.log('Erro ao deletar embalagem')
    )
  }
  
  selectEdit(index: number, idCarro: number) {
    this.isEditTrueIndex = index;

    this.etiquetasService.getSingleEtiquetas(idCarro)
    .subscribe((data: any) => {
      this.updateEmbalagensForm = this.formBuilder.group({
        name: [data.name]
      })
    });
  }

  editar(idCarro: number) {
    const name = this.updateEmbalagensForm.getRawValue() as any;

    this.etiquetasService.updateEmbalagens(idCarro, name).subscribe(
      data => console.log(`Embalagem atualizada com sucesso.`),
      err => console.log('Erro ao atualizar embalagem.')
    )
  }
  
  voltar() {
    this.isEditTrueIndex = -1;
  }
}
