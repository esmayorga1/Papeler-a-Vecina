import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router'; // Importar el Router para redirigir después de registrar
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'] // Corregí `styleUrl` por `styleUrls`
})
export class RegisterComponent {
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  errorMessage: string = ''; // Variable para mostrar el mensaje de error
  showSuccessModal: boolean = false; // Variable para mostrar el modal de éxito

  constructor(private authService: AuthService, private router: Router) {}

  // Método para registrar al usuario
  async registrarUsuario() {
    // Verificar si las contraseñas coinciden antes de llamar al servicio
    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Las contraseñas no coinciden. Por favor, verifica e intenta nuevamente.';
      return;  // Detener la ejecución si las contraseñas no coinciden
    }

    // Verificar si el email y las contraseñas no están vacíos
    if (!this.email || !this.password || !this.confirmPassword) {
      this.errorMessage = 'Por favor, completa todos los campos.';
      return;
    }

    try {
      // Llamar al servicio para crear el usuario solo si las contraseñas coinciden
      await this.authService.createUser(this.email, this.password);
      console.log('Usuario registrado con éxito');
      
      // Mostrar el modal de éxito
      this.showSuccessModal = true;

      // Limpiar el formulario
      this.email = '';
      this.password = '';
      this.confirmPassword = '';

      // Redirigir al login o a otra página después del registro
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 2000); // Esperar 2 segundos antes de redirigir

    } catch (error) {
      console.error('Error al registrar usuario:', error);
      this.errorMessage = 'Error al registrar usuario. Intenta nuevamente más tarde.';
    }
  }

  // Método para cerrar el modal de éxito
  closeModal() {
    this.showSuccessModal = false;
  }
}
