import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductServiceService } from '../../../services/product-service.service';


@Component({
  selector: 'app-products',
  standalone: true,
  imports: [ CommonModule, FormsModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
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
    this.productService.getProducts().subscribe(products => {
      this.products = products;
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

  editProduct() {
    // Lógica para editar un producto
  }

  deleteProduct() {
    // Lógica para eliminar un producto
  } 

}
