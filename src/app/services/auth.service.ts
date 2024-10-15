import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private afAuth: AngularFireAuth) { }

  async createUser(email: string, password: string): Promise<void> {
    try {
      await this.afAuth.createUserWithEmailAndPassword(email, password);
    } catch (error) {
   
      console.error('Error al crear usuario:', error);
      throw error;
    }
  }


  async loginWithEmail2(email: string, password: string): Promise<void> {
    try {
      await this.afAuth.signInWithEmailAndPassword(email, password);
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      throw error;
    }
  }

  async loginWithEmail(email: string, password: string): Promise<void> {
    try {
      await this.afAuth.signInWithEmailAndPassword(email, password);
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      throw error; // Mantén el lanzamiento del error para manejarlo en el componente
    }
  }


  // Método para cerrar sesión
  async logout(): Promise<void> {
    try {
      await this.afAuth.signOut();
    } catch (error) {
      // Manejar errores aquí, como mostrar un mensaje al usuario
      console.error('Error al cerrar sesión:', error);
      throw error;
    }
  }
  isLoggedIn(): Observable<boolean> {
    return this.afAuth.authState.pipe(
      map(user => !!user)
    );
  }
}
