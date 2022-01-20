import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Subscription } from 'rxjs';

import { EtiquetasGerencialService } from 'src/app/services/etiquetas-gerencial.service';
import { ListaCarrosService } from 'src/app/services/lista-carros.service';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';
import { SharedService } from 'src/app/shared/shared.service';

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
  getEventSubscription!: Subscription;
  idCarro: number = 0;
  statusMaintenance: String = '';

  embalagensForm!: FormGroup;
  updateEmbalagensForm!: FormGroup;
  inactivateCartForm!: FormGroup;
  finishMaintenanceForm!: FormGroup;

  listaCarros: any[] = [];
  listaEtiquetas: any[] = []
  listaManutencao: any[] = []

  constructor(
    private listaCarrosService: ListaCarrosService, 
    private formBuilder: FormBuilder,
    private etiquetasService: EtiquetasGerencialService,
    private matDialog: MatDialog,
    private sharedService: SharedService
  ) {
    this.getEventSubscription = this.sharedService.getEditEmbalagemEvent()
    .subscribe(() => {
      this.editar(this.idCarro);
    });
  }

  ngOnInit(): void {
    this.getListaEmbalagens();
    this.getListaMaintenances();

    this.etiquetasService.getEtiquetas().subscribe((etiquetas: any) => {
      // cartIssues pode vir vazio, aqui preencho somente quanto tiver objeto em cartIssues
      etiquetas.forEach((element: any) => {
        if (element.cartIssues.length === 1) {
          this.listaEtiquetas.push(element);
        }        
      });
    },
    err => console.log(err)
    );

    this.embalagensForm = this.formBuilder.group({
      name: ['']
    })
    
    this.updateEmbalagensForm = this.formBuilder.group({
      name: ['']
    })
    
    this.inactivateCartForm = this.formBuilder.group({
      status: ['']
    })
    
    this.finishMaintenanceForm = this.formBuilder.group({
      finishedAt: ['']
    })
  }
  
  getListaEmbalagens() {
    this.listaCarrosService.getListaCarros().subscribe((carros: any) => {
      carros.forEach((carro: any) => {
        this.listaCarros.push(carro);
      });
    })
  }

  getListaMaintenances() {
    this.etiquetasService.getAllMaintenances().subscribe((manutencao: any) => {
      // cartIssues pode vir vazio, aqui preencho somente quanto tiver objeto em cartIssues
      manutencao.forEach((element: any) => {
        console.log(element);
        this.listaManutencao.push(element);
      });
    },
    err => console.log(err)
    );
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
    this.isEditTrueIndex = -1;

    this.etiquetasService.updateEmbalagens(idCarro, name).subscribe(
      data => {
        this.listaCarros = [];
        console.log(`Embalagem atualizada com sucesso.`);
        this.getListaEmbalagens();
      },
      err => console.log('Erro ao atualizar embalagem.')
    )
  }
  
  voltar() {
    this.isEditTrueIndex = -1;
  }

  openDialog(texto: String, id: number) {    
    const dialogConfig = new MatDialogConfig();
    this.idCarro = id;

    dialogConfig.disableClose = true;
    dialogConfig.width = "250px";
    dialogConfig.height = "150px";
    dialogConfig.data = {
      titulo: texto,
    }

    const dialog = this.matDialog.open(ConfirmationDialogComponent, dialogConfig);    
  }

  changeCartStatus(id: number) {
    const status = this.inactivateCartForm.getRawValue() as any;
    console.log(status);

    this.etiquetasService.inactivateEtiqueta(id, status)
    .subscribe(
      data => console.log(`Função realizada com sucesso. ${data}`),
      err => console.log('Ocorreu um erro ao tentar ativar/desativar a etiqueta'),
    )
  }

  setFinishedAtMaintenance(idManutencao: number) {
    var data = new Date().toISOString();
    const finishedAt = { "finishedAt": data };

    this.etiquetasService.finishMaintenance(idManutencao, finishedAt)
    .subscribe(
      data => {
        console.log(`Manuntenção finalizada. ${data}`);
      },
      err => console.log(`Ocorreu um erro ao tentar finalizar manutencao. ${err}`),
    );
  }

  changeMaintenanceStatus(idManutencao: number, idCart: number) {
    console.log(this.statusMaintenance);
    console.log(idManutencao);
    console.log(idCart);
    var data = new Date().toISOString();
    const status = { "status": "INACTIVE" };
    const finishedAt = { "finishedAt": data };

    if (this.statusMaintenance === "IDLE") {
      this.etiquetasService.finishMaintenance(idManutencao, finishedAt)
      .subscribe(
        data => {
          this.listaManutencao = [];
          console.log(`Manuntenção finalizada. ${data}`);
          this.getListaMaintenances();
        },
        err => console.log(`Ocorreu um erro ao tentar finalizar manutencao. ${err}`),
      );

    } else {
      this.etiquetasService.finishMaintenance(idManutencao, finishedAt)
      .subscribe(
        data => {
          console.log(`Manuntenção finalizada. ${data}`);

          console.log('desativando carrinho');
          this.etiquetasService.inactivateEtiqueta(idCart, status)
          .subscribe(
            data => {
              this.listaManutencao = [];
              console.log(`Função realizada com sucesso. ${data}`);
              this.getListaMaintenances();
            },
            err => console.log(`Ocorreu um erro ao tentar ativar/desativar o carrinho. ${err}`),
          );
        },
        err => console.log(`Ocorreu um erro ao tentar finalizar manutencao. ${err}`),
      );
      
      
    }
  }
}
