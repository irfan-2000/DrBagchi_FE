import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-inside-layout',
  standalone: false,
  templateUrl: './inside-layout.component.html',
  styleUrl: './inside-layout.component.css'
})
 export class InsideLayoutComponent implements OnInit {
  constructor() {
    console.log('LayoutInsideComponent constructor'); // runs on each instantiation
  }

  ngOnInit(): void {
    console.log('LayoutInsideComponent ngOnInit');
  }

  ngAfterViewInit(): void {
    console.log('LayoutInsideComponent ngAfterViewInit');
  }
}


