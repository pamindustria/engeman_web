import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-doca',
  templateUrl: './doca.component.html',
  styleUrls: ['./doca.component.css']
})
export class DocaComponent implements OnInit {
  isDocaSelected: boolean = false;

  constructor() { }

  ngOnInit(): void {
    this.docaWasSelected();
  }

  docaWasSelected() {
    setInterval(() => {
      this.isDocaSelected = !this.isDocaSelected;
      console.log(this.isDocaSelected);

    }, 1000);
  }

}
