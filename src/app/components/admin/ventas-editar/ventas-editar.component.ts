import { Component, Input, OnInit } from '@angular/core';
import { VentasService } from '../../../services/ventas.service';
import { ProductServiceService } from '../../../services/product-service.service';
import { FormsModule } from '@angular/forms';
import { CommonModule, NgIf } from '@angular/common';

@Component({
  selector: 'app-ventas-editar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ventas-editar.component.html',
  styleUrls: ['./ventas-editar.component.css']
})
export class VentasEditarComponent implements OnInit {
  ventas = {
    id: '',
    date: '',           // Fecha de venta
    productId: '',      // ID del producto
    quantity: 0,        // Cantidad vendida
    total: 0            // Total de la venta
    
  };

  @Input() selectedVentas: any;
  categories: any[] = []; // Lista de productos
  isOpen = false;
  originalQuantity = 0; // Cantidad vendida original para comparar

  constructor(
    private ventasService: VentasService,
    private productService: ProductServiceService // Servicio para obtener los productos
  ) {}

  ngOnInit() {
    // Cargar productos disponibles
    this.productService.getProducts1().subscribe(products => {
      this.categories = products.map(product => ({
        id: product.id,
        name: product.data.name
      }));
    });
  }

  // Función para editar la venta anterior
  // editProduct2() {
    // if (this.ventas && this.ventas.id) {
      // 
      // this.ventasService.updateVentas(this.ventas.id, this.ventas)
        // .then(() => {
          // console.log('Venta actualizada con éxito');
          // this.close();
        // })
        // .catch((error) => {
          // console.error('Error al actualizar la venta:', error);
        // });
    // }
  // }

  // ===========================Función de Editar Venta===============================

  editProduct() {
    if (this.ventas && this.ventas.id) {
      // Obtener el stock actual del producto desde la base de datos
      this.productService.getProductByIdOnce(this.ventas.productId).subscribe((product: any) => {
        if (product && product.data && product.data.stockQuantity !== undefined) {
          const stockActual = product.data.stockQuantity; 
          console.log('Stock actual en la base de datos:', stockActual);

          const cantidadVendidaNueva = this.ventas.quantity; 
          const cantidadVendidaOriginal = this.selectedVentas.quantity; 

          console.log('Cantidad vendida original:', cantidadVendidaOriginal);
          console.log('Nueva cantidad editada:', cantidadVendidaNueva);

        
          const diferencia = cantidadVendidaNueva - cantidadVendidaOriginal;
          console.log('Diferencia calculada:', diferencia);

        
          const nuevoStock = stockActual - diferencia; // Ajuste basado en la diferencia
          console.log('Nuevo stock después del ajuste:', nuevoStock);

          // Actualizar el stock en la base de datos
          this.productService.updateProductStock2(this.ventas.productId, nuevoStock).then(() => {
            console.log('Stock actualizado correctamente');
       
            this.ventasService.updateVentas(this.ventas.id, this.ventas)
              .then(() => {
                console.log('Venta actualizada con éxito');
                this.close(); // Cerrar el modal
              })
              .catch((error) => {
                console.error('Error al actualizar la venta:', error);
              });
          }).catch((error) => {
            console.error('Error al actualizar el stock:', error);
          });
        } else {
          console.error('No se pudo recuperar el stock del producto');
        }
      });
    }
  }    
  
  // Abrir el modal y llenar los datos
  open() {
    this.isOpen = true;
    if (this.selectedVentas) {
      this.ventas = { ...this.selectedVentas }; // Copiar los datos de la venta seleccionada
    }
  }

  // Cerrar el modal y reiniciar el formulario
  close() {
    this.isOpen = false;
    this.ventas = {
      id: '',
      date: '',
      productId: '',   // Reiniciar el ID del producto
      quantity: 0,
      total: 0
    };
  }
}
