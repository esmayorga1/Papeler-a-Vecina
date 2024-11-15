import { Component } from '@angular/core';
import { ProductServiceService } from '../../../services/product-service.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-editar-product',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './editar-product.component.html',
  styleUrl: './editar-product.component.css',
})
export class EditarProductComponent {
  product = {
    id: '',
    name: '',
    purchasePrice: 0,
    salePrice: 0,
    stockQuantity: 0,
    category: '',
    brand: '',
    supplier: '',
    description: '',
    imageUrl: '',
  };

  categories: any;
  isOpen = false;

  constructor(private productService: ProductServiceService) {}

  // =============== Función para Editar Producto =================================

  editProduct() {
    if (this.product && this.product.id) {
      // Llamar al servicio para actualizar el producto en la base de datos
      this.productService
        .updateProduct(this.product.id, this.product)
        .then(() => {
          console.log('Producto actualizado con éxito');
          this.close();
        })
        .catch((error) => {
          console.error('Error al actualizar el producto:', error);
        });
    }
  }

  // =================Abrir Modal===================
  open() {
    this.isOpen = true;
  }

  // =================Cerrar Modal===================
  close() {
    this.isOpen = false;

    // Reiniciar el formulario
    this.product = {
      id: '',
      name: '',
      purchasePrice: 0,
      salePrice: 0,
      stockQuantity: 0,
      category: '',
      brand: '',
      supplier: '',
      description: '',
      imageUrl: '',
    };
  }
}
