import { Component } from '@angular/core';
import { debug } from 'console';

@Component({
  selector: 'app-layout-inside',
  standalone: false,
  templateUrl: './layout-inside.component.html',
  styleUrl: './layout-inside.component.css'
})
export class LayoutInsideComponent 
{
sidebarOpen = false;
 
 menu = [
  { name: 'Dashboard', icon: 'home', route: '/app/dashboard' },
  { name: 'Courses', icon: 'book', route: '/app/courses' },
  { name: 'My Courses', icon: 'users', route: '/app/mycourses' },
  { name: 'Payments', icon: 'credit-card', route: '/app/payments' },
  { name: 'Quiz', icon: 'clipboard-check', route: '/app/quiz' },
  { name: 'Settings', icon: 'cog', route: '/settings' }
];


  


  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }
dropdownOpen: boolean = false;

toggleDropdown()
{
   
  this.dropdownOpen = !this.dropdownOpen;
}

// close dropdown when clicked outside
ngOnInit() {
  document.addEventListener('click', () => {
    this.dropdownOpen = false;
  });

      console.log('LayoutInsideComponent: ngOnInit');

}

logout() {
  console.log("Logging out...");
  // TODO: Add your logout logic here (clear tokens, redirect, etc.)
}



 constructor() {
    console.log('LayoutInsideComponent: constructor');
  }
 

  ngAfterViewInit(): void {
    console.log('LayoutInsideComponent: ngAfterViewInit');
  }

  ngOnDestroy(): void {
    console.log('LayoutInsideComponent: ngOnDestroy');
  }






}
