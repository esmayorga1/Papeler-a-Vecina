import { Component } from '@angular/core';
import type { ModalOptions, ModalInterface } from 'flowbite'
import { ProductsComponent } from "../../admin/products/products.component";
import { RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';
import { VentasComponent } from "../../admin/ventas/ventas.component";
import { DashboardComponent } from "../../admin/dashboard/dashboard.component";
import { ReportesComponent } from "../../admin/reportes/reportes.component";
import { AuthService } from '../../../services/auth.service';
import { RegisterComponent } from '../../autenticacion/register/register.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [ProductsComponent, RouterLink, NgIf, VentasComponent, DashboardComponent, ReportesComponent, RegisterComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {


isSidebarOpen: boolean = false;  
isMenuDropdownOpen: boolean = false;  
isventas: boolean = false;
isReportes: boolean = false;
isDasboard: boolean = true;
isRegister: boolean = false;

constructor(private authService: AuthService) { }



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
  this.isRegister = false
  this.isSidebarOpen = false
  
}

toggleMenuDropdownVentas() {
  this.isventas = !this.isventas;
  this.isMenuDropdownOpen = false
  this.isReportes = false
  this.isDasboard = false
  this.isRegister = false
  this.isSidebarOpen = false
    
}


toggleMenuDropdownReportes() {
  this.isReportes = !this.isReportes
  this.isventas = false
  this.isMenuDropdownOpen = false  
  this.isDasboard = false 
  this.isRegister = false
  this.isSidebarOpen = false
}

toggleMenuDropdownDasboard() {
  this.isDasboard = !this.isDasboard
  this.isventas = false
  this.isMenuDropdownOpen = false   
  this.isReportes = false
  this.isRegister = false
  this.isSidebarOpen = false
}

toggleMenuDropdownRegister(){
  this.isRegister = !this.isRegister
  this.isDasboard = false
  this.isventas = false
  this.isMenuDropdownOpen = false   
  this.isReportes = false
  this.isSidebarOpen = false

}

// Metodo de cerrar sesion

// Método para cerrar sesión
async logout() {
  try {
    await this.authService.logout();
    // Puedes redirigir al usuario a la página de login después de cerrar sesión
    console.log('Sesión cerrada correctamente');
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
  }
}
  

}