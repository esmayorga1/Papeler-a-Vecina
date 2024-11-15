import { Component } from '@angular/core';
import { VentasService } from '../../../services/ventas.service';
import { ProductServiceService } from '../../../services/product-service.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-ventas-add',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ventas-add.component.html',
  styleUrl: './ventas-add.component.css'
})
export class VentasAddComponent {
  isOpen = false;  // Controla la apertura del modal

  products: any[] = [];  // Lista de productos disponibles
  selectedProduct: string = '';  // ID del producto seleccionado
  sale = {
    productId: '',
    quantity: 1,
    total: 0,
    date: ''
  };
  isTotalEditable = false;  // Variable para controlar si el total es editable

  constructor(
    private ventasService: VentasService,
    private productService: ProductServiceService
  ) {}

  ngOnInit(): void {
    this.loadProducts();  // Cargar los productos al inicializar el componente
  }

  // Cargar los productos desde la base de datos
  loadProducts() {
    this.productService.getProducts1().subscribe(products => {
      this.products = products.map(p => ({ id: p.id, ...p.data })); 
    });
  }

  // Función para editar una venta
  editSale(venta: any) {
    // Asignamos el producto correspondiente de la venta a 'selectedProduct'
    this.selectedProduct = venta.productId; 

    // Cargar los datos de la venta en el formulario
    this.sale = {
      productId: venta.productId,
      quantity: venta.quantity,
      total: venta.total,
      date: venta.date
    };

    // Abrir el modal de edición
    this.openModal();
  }

  // Actualizar el precio total automáticamente cuando cambia la cantidad o el producto
  updateTotal(): void {
    if (this.selectedProduct) {
      const selectedProduct = this.products.find(
        (product) => product.id === this.selectedProduct
      );
      
      if (selectedProduct) {
        // Usar salePrice directamente como el precio de venta
        this.sale.total = selectedProduct.salePrice * this.sale.quantity;
        this.isTotalEditable = false; // Deshabilitar la edición automática
      }
    }
  }

  // Función para registrar la venta
registerSale(): void {
  if (this.selectedProduct && this.sale.quantity && this.sale.date) {
    const selectedProduct = this.products.find(
      (product) => product.id === this.selectedProduct
    );

    if (selectedProduct) {
      if (this.sale.total === 0) {
        this.sale.total = selectedProduct.salePrice * this.sale.quantity;
      }
      this.sale.productId = this.selectedProduct;

      // Registrar la venta
      this.ventasService.addVenta(this.sale)
        .then(() => {
          console.log('Venta registrada con éxito');
          // Reducir el stock después de registrar la venta
          return this.productService.updateProductStock(this.selectedProduct, this.sale.quantity);
        })
        .then(() => {
          console.log('Stock actualizado correctamente');
          this.resetForm();  // Limpiar el formulario
        })
        .catch((error) => {
          console.error('Error al registrar la venta o actualizar el stock:', error);
        });
    } else {
      console.error('Producto no encontrado');
    }
  } else {
    console.error('Faltan datos para registrar la venta');
  }
}


  // Función para registrar la venta
  registerSale2(): void {
    if (this.selectedProduct && this.sale.quantity && this.sale.date) {
      const selectedProduct = this.products.find(
        (product) => product.id === this.selectedProduct
      );
      if (selectedProduct) {
        // Asegurarse de que el precio total se calcule si no está establecido
        if (this.sale.total === 0) {
          this.sale.total = selectedProduct.salePrice * this.sale.quantity;
        }
        this.sale.productId = this.selectedProduct;
        // Registrar la venta
        this.ventasService.addVenta(this.sale)
          .then(() => {
            console.log('Venta registrada con éxito');
            this.resetForm();  // Limpiar el formulario
          })
          .catch((error) => {
            console.error('Error al registrar la venta:', error);
          });
      } else {
        console.error('Producto no encontrado');
      }
    } else {
      console.error('Faltan datos para registrar la venta');
    }
  }

  // Limpiar el formulario
  resetForm(): void {
    this.selectedProduct = '';
    this.sale = {
      productId: '',
      quantity: 1,
      total: 0,
      date: '',
    };
    this.isTotalEditable = false;  // Restablecer el estado de la edición
  }

  // =============Abrir modal======================
  open() {
    this.isOpen = true;
  }

  // =============Cerrar modal======================
  close() {
    this.isOpen = false;
  }

  // Método para abrir el modal
  openModal() {
    this.isOpen = true;
  }

  // Método para cerrar el modal
  closeModal() {
    this.isOpen = false;
  }
}
