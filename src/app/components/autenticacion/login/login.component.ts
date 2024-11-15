import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';

import { map, Observable } from 'rxjs';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  constructor(private authService: AuthService, private router: Router) { }

  login() {
    const email = (document.getElementById('emailUsuario') as HTMLInputElement).value;
    const password = (document.getElementById('passwordUsuario') as HTMLInputElement).value;
  
    this.authService.loginWithEmail(email, password)
      .then(() => {
        console.log("Inicio de sesión exitoso");
        this.router.navigate(['/admin']); 
      })
      .catch(error => {
        // Manejar errores específicos
        if (error.code === 'auth/user-not-found') {
          alert("Parece que no tienes una cuenta con este correo. ¿Quieres registrarte?");
        } else if (error.code === 'auth/wrong-password') {
          alert("La contraseña que ingresaste es incorrecta. Por favor, inténtalo de nuevo.");
        } else if (error.code === 'auth/invalid-email') {
          alert("El formato del correo electrónico no es válido. Asegúrate de escribirlo correctamente.");
          
        }          
      
        
        
        else {
          alert("Se ha producido un error inesperado. Por favor, inténtalo más tarde o contacta a nuestro equipo de soporte.");
        }
        console.error("Error al iniciar sesión:", error);
      });    
      
  
      
  }}

