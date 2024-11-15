import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductServiceService } from '../../../services/product-service.service';

@Component({
  selector: 'app-products-add',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './products-add.component.html',
  styleUrls: ['./products-add.component.css'],
})
export class ProductsAddComponent {
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

  // =============Añadir Producto======================
  addProduct() {
    // Verificar que todos los campos requeridos estén completos
    if (
      this.product.name &&
      this.product.purchasePrice &&
      this.product.salePrice &&
      this.product.brand &&
      this.product.supplier &&
      this.product.stockQuantity &&
      this.product.category
    ) {
      // Llamar al servicio para agregar el producto
      this.productService
        .addProduct(this.product)
        .then(() => {
          console.log('Producto agregado exitosamente');
          // Limpiar el formulario o hacer algo adicional si es necesario
          this.resetForm();
        })
        .catch((error: any) => {
          console.error('Error al agregar el producto:', error);
        });
    } else {
      console.log('Por favor, complete todos los campos');
    }
  }

  // =============Restablecer el formulario======================
  resetForm() {
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

  // =============Abrir modal======================
  open() {
    this.isOpen = true;
  }

  // =============Cerrar modal======================
  close() {
    this.isOpen = false;
  }
}
