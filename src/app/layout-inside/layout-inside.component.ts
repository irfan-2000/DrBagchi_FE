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
    { name: 'Dashboard', icon: 'home', route: '/dashboard' },
    { name: 'Courses', icon: 'book', route: '/courses' },
    { name: 'Students', icon: 'users', route: '/students' },
    { name: 'Payments', icon: 'credit-card', route: '/payments' },
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
}

logout() {
  console.log("Logging out...");
  // TODO: Add your logout logic here (clear tokens, redirect, etc.)
}










}
