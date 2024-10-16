import { Routes } from '@angular/router';
import { LoginComponent } from './components/autenticacion/login/login.component';
import { HomeComponent } from './components/layaout/home/home.component';
import { HeaderComponent } from './components/layaout/header/header.component';
import { ProductsComponent } from './components/admin/products/products.component';
import { ProductsAddComponent } from './components/admin/products-add/products-add.component';


export const routes: Routes = [  
    { path: '', component: HeaderComponent },   

      
];
