import { Routes } from '@angular/router';
import { LoginComponent } from './components/autenticacion/login/login.component';
import { HomeComponent } from './components/layaout/home/home.component';
import { HeaderComponent } from './components/layaout/header/header.component';
import { ProductsComponent } from './components/admin/products/products.component';
import { ProductsAddComponent } from './components/admin/products-add/products-add.component';
import { EditarProductComponent } from './components/admin/editar-product/editar-product.component';
import { VentasAddComponent } from './components/admin/ventas-add/ventas-add.component';
import { loginGuard } from './guard/login.guard';



export const routes: Routes = [  
    { path: '', component:  LoginComponent }, 
    { path: 'admin', component: HeaderComponent, canActivate: [loginGuard]  },
    // { path: 'admin', component: HeaderComponent  },
    //   
];
