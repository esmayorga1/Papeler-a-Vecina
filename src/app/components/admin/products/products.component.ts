import { CommonModule } from '@angular/common';
import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductServiceService } from '../../../services/product-service.service';
import { ProductsAddComponent } from '../products-add/products-add.component';
import { EditarProductComponent } from '../editar-product/editar-product.component';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule, ProductsAddComponent, EditarProductComponent],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'] 
})
export class ProductsComponent implements AfterViewInit {
  @ViewChild(ProductsAddComponent) modalComponent!: ProductsAddComponent;
  @ViewChild(EditarProductComponent) editModalComponent!: EditarProductComponent;

  searchTerm: string = '';
  selectedCategory: string = '';
  products: any[] = [];
  categories: string[] = [];
  selectedProduct: any;
  isEditOpen: boolean = false;
  
  constructor(private productService: ProductServiceService) {}

  ngOnInit() {
    this.loadProducts();
    this.loadCategories()
  }

  ngAfterViewInit() {
   
    console.log(this.modalComponent);
    console.log(this.editModalComponent);
  }

  // =============== Cargar productos desde Firebase =======================
  loadProducts() {
    this.productService.getProducts1().subscribe(products => {
      this.products = products.map(p => ({ id: p.id, ...p.data })); 
    });
  }

  // ======================Filtrar Productos=================================

  filteredProducts() {
    return this.products.filter((product) => {
      const matchesSearch =
        product.name ? product.name.toLowerCase().includes(this.searchTerm.toLowerCase()) : false;
      const matchesCategory = this.selectedCategory ? product.category === this.selectedCategory : true;
      return matchesSearch && matchesCategory;
    });
  }
  filteredProducts1() {
    return this.products.filter(product => {
      const matchesSearch = product.name ? product.name.toLowerCase().includes(this.searchTerm.toLowerCase()) : false;
      const matchesCategory = this.selectedCategory ? product.category === this.selectedCategory : true;
      return matchesSearch && matchesCategory;
    });
  }

  loadCategories() {
    this.productService.getCategories().subscribe((products) => {
      const allCategories = products.map((product: any) => product.category);
      this.categories = [...new Set(allCategories)]; // Eliminar categorías duplicadas
    });
  }


  // ======================Editar Producto=================================
  
  
  editProduct(product: any) {
    this.selectedProduct = product;
    
    // Llamar al modal de edición y pasar el producto seleccionado
    this.editModalComponent.product = { ...product }; 
    this.editModalComponent.open();


    // Recargar los productos después de que el modal de edición se cierre
    this.editModalComponent.close = () => {
    this.loadProducts(); 
    this.editModalComponent.isOpen = false;};
  }
  

  // ======================Eliminar Producto=================================
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

  // ======================Abrir Modal para Añadir Producto =================================
  openAddProductModal() {
    if (this.modalComponent) {
      this.modalComponent.open();
    } else {
      console.error('modalComponent no está definido');
    }
  }

 // ======================Abrir Modal para Editar Producto =================================
openEditProductModal() {
  if (this.editModalComponent) {
    this.editModalComponent.open();
  } else {
    console.error('modalComponent no está definido');
  }
}

openAddCategoryModal(){}

}