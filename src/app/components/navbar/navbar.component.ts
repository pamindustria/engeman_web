import { AfterViewInit, Component, ElementRef, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, AfterViewInit {
  screenWidth: any;
  isMobile: boolean = false;

  constructor(private el: ElementRef) { }
  

  ngOnInit(): void {
    this.screenWidth = window.innerWidth;
    if (this.screenWidth < 1000) {
      this.isMobile = true;
    }
    
    document.body.classList.add('dark-theme');
    
  }

  ngAfterViewInit(): void {
    var element = this.el.nativeElement.querySelector('nav');
    element.classList.remove("bg-primary");
  }

  toggleDarkTheme(): void {
    document.body.classList.toggle('dark-theme');
    var element = this.el.nativeElement.querySelector('nav');

    if (!element.classList.contains('bg-primary')) {
      element.classList.add('bg-primary');
    } else {
      element.classList.remove("bg-primary");
    }
  }
}
