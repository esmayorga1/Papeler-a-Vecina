import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductServiceService } from '../../../services/product-service.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'] // Asegúrate de que este es el nombre correcto
})
export class ProductsComponent {
  searchTerm: string = '';
  selectedCategory: string = '';
  products: any[] = [];
  categories = ['Categoría A', 'Categoría B', 'Categoría C'];
  
  constructor(private productService: ProductServiceService) {}

  ngOnInit() {
    this.loadProducts();
  }

  // Cargar productos desde Firebase
  loadProducts() {
    this.productService.getProducts1().subscribe(products => {
      this.products = products.map(p => ({ id: p.id, ...p.data })); // Asegúrate de que cada producto tenga un ID
    });
  }

  filteredProducts() {
    return this.products.filter(product => {
      const matchesSearch = product.name ? product.name.toLowerCase().includes(this.searchTerm.toLowerCase()) : false;
      const matchesCategory = this.selectedCategory ? product.category === this.selectedCategory : true;
      return matchesSearch && matchesCategory;
    });
  }

  openAddProductModal() {
    // Lógica para abrir el modal de añadir producto
  }

  editProduct(productId: string) {
    // Lógica para editar un producto
    console.log('Editando producto con ID:', productId);
  }

  deleteProduct(productId: string) {
    console.log('Eliminando producto con ID:', productId); // Asegúrate de que el ID es correcto
  
    if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      this.productService.deleteProduct(productId)
        .then(() => {
          console.log('Producto eliminado con éxito');
          this.loadProducts(); // Recargar los productos después de eliminar
        })
        .catch(error => {
          console.error('Error al eliminar el producto:', error);
        });
    }
  }
}
