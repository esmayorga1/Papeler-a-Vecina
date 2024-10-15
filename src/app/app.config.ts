import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';

export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
  firebaseConfig: {
    apiKey: "AIzaSyALrj1bXtHleGKa2vioiE1TT2KZGFoLK6g",
    authDomain: "papeleriavecina-85919.firebaseapp.com",
    projectId: "papeleriavecina-85919",
    storageBucket: "papeleriavecina-85919.appspot.com",
    messagingSenderId: "1037392817914",
    appId: "1:1037392817914:web:b57b1d23513b002fbf6343",
    measurementId: "G-688S0F8KSC"   
    
  
  }
};
  

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), 
    provideClientHydration(),
    importProvidersFrom(
      HttpClientModule,
      AngularFireModule.initializeApp(environment.firebaseConfig),
      AngularFireModule,
      AngularFireAuthModule
    )
  ]
};
