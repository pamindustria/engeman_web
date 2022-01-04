import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  screenWidth: any;
  isMobile: boolean = false;

  constructor() { }

  ngOnInit(): void {
    this.screenWidth = window.innerWidth;
    if (this.screenWidth < 1000) {
      this.isMobile = true;
    }
  }

}
