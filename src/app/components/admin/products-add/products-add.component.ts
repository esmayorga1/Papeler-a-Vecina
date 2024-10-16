import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductServiceService } from '../../../services/product-service.service';

@Component({
  selector: 'app-products-add',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './products-add.component.html',
  styleUrl: './products-add.component.css'
})
export class ProductsAddComponent {

  product = {
    name: '',
    price: 0,
    quantity: 0,
    category: '',
    description: '',
    imageUrl: ''
  };

  categories:any

  

  constructor(private productService: ProductServiceService) {}

  addProduct() {
    if (this.product.name && this.product.price) {
      this.productService.addProduct(this.product).then(() => {
        console.log('Producto agregado exitosamente');
        // Limpiar el formulario o hacer algo adicional
      }).catch((error: any) => {
        console.error('Error al agregar el producto:', error);
      });
    } else {
      console.log('Por favor, complete todos los campos');
    }
  }


  


}
