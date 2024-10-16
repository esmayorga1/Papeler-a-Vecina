import { Component } from '@angular/core';
import type { ModalOptions, ModalInterface } from 'flowbite'
import { ProductsComponent } from "../../admin/products/products.component";
import { RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';
import { VentasComponent } from "../../admin/ventas/ventas.component";
import { DashboardComponent } from "../../admin/dashboard/dashboard.component";
import { ReportesComponent } from "../../admin/reportes/reportes.component";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [ProductsComponent, RouterLink, NgIf, VentasComponent, DashboardComponent, ReportesComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

isSidebarOpen: boolean = false;  
isMenuDropdownOpen: boolean = false;  
isventas: boolean = false;
isReportes: boolean = false;
isDasboard: boolean = true



toggleSidebar() {
  this.isSidebarOpen = !this.isSidebarOpen;  
  console.log('Sidebar toggled, isSidebarOpen:', this.isSidebarOpen);  
  document.body.classList.toggle('sidebar-hidden', !this.isSidebarOpen);  
}
// Método para alternar el menú desplegable
toggleMenuDropdown() {
  this.isMenuDropdownOpen = !this.isMenuDropdownOpen;
  this.isventas = false  
  this.isDasboard = false
  this.isReportes = false
  
}

toggleMenuDropdownVentas() {
  this.isventas = !this.isventas;
  this.isMenuDropdownOpen = false
  this.isReportes = false
  this.isDasboard = false
    
}


toggleMenuDropdownReportes() {
  this.isReportes = !this.isReportes
  this.isventas = false
  this.isMenuDropdownOpen = false  
  this.isDasboard = false 
}

toggleMenuDropdownDasboard() {
  this.isDasboard = !this.isDasboard
  this.isventas = false
  this.isMenuDropdownOpen = false   
  this.isReportes = false
}
  

}