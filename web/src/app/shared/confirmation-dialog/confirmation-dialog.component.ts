import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SharedService } from '../shared.service';

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.css']
})
export class ConfirmationDialogComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<ConfirmationDialogComponent>,
    private matDialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private sharedService: SharedService
  ) { }

  ngOnInit(): void {
    this.dialogRef.keydownEvents().subscribe(event => {
      if (event.key === "Escape") {
        this.matDialog.closeAll();
      }
    }); 
  }

  sendEvent() {
    if (this.data.idDialog === 0) {
      this.sharedService.sendEditEmbalagemEvent();
      this.closeModal();
    } else {
      this.sharedService.sendDeleteEmbalagemEvent();
      this.closeModal();
    }
  }

  closeModal() {
    this.dialogRef.close();      
  }
}
