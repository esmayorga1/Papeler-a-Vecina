import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core'; 
import { ProductServiceService } from '../../../services/product-service.service';
import { VentasService } from '../../../services/ventas.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VentasAddComponent } from '../ventas-add/ventas-add.component';
import { VentasEditarComponent } from '../ventas-editar/ventas-editar.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-ventas',
  standalone: true,
  imports: [CommonModule, FormsModule, VentasAddComponent, VentasEditarComponent],
  templateUrl: './ventas.component.html',
  styleUrls: ['./ventas.component.css']
})
export class VentasComponent implements AfterViewInit, OnInit {

  @ViewChild(VentasAddComponent) modalComponent!: VentasAddComponent;
  @ViewChild(VentasEditarComponent) editModalComponent!: VentasEditarComponent;

  searchTerm: string = '';
  ventas: any[] = [];
  selectedVentas: any;
  isEditOpen: boolean = false;
  productName: string = '';
  productMap: { [id: string]: string } = {}; // Mapa de productos
  

  constructor(
    private ventasService: VentasService,
    private productService: ProductServiceService
  ) {}

  ngOnInit() {
    this.loadVentasAndProducts();
  }

  ngAfterViewInit() {
    console.log(this.modalComponent);
    console.log(this.editModalComponent);
  }

  // Cargar ventas y productos desde Firebase y mapear nombres de productos
  loadVentasAndProducts() {
    // Cargar productos
    this.productService.getProducts1().subscribe(products => {
      this.productMap = {}; // Reinicia el mapa de productos
      products.forEach(p => {
        this.productMap[p.id] = p.data.name; // Mapea cada id al nombre
      });
      // Cargar ventas después de obtener los productos
      this.ventasService.getVentas().subscribe(ventas => {
        this.ventas = ventas.map(v => ({
          ...v.data,
          id: v.id,
          productName: this.productMap[v.data.productId] || 'Producto no disponible'
        }));
      });
    }, error => {
      console.error('Error al cargar productos:', error);
    });
  }

  // Filtrar ventas por término de búsqueda
  filteredVentas() {
    return this.ventas.filter(venta => {
      const matchesSearch = venta.date 
        ? venta.date.toLowerCase().includes(this.searchTerm.toLowerCase())
        : false;
      return matchesSearch;
    });
  }

  // Editar venta seleccionada
  editProduct(venta: any) {
    this.selectedVentas = venta;
    
    if (this.editModalComponent) {
      // Asignar los datos seleccionados al componente de edición
      this.editModalComponent.selectedVentas = this.selectedVentas;
      
      // Abrir el modal de edición
      this.editModalComponent.open();

      // Recargar las ventas después de que el modal se cierre
      this.editModalComponent.close = () => {
        this.loadVentasAndProducts();
        this.editModalComponent.isOpen = false;
      };
    } else {
      console.error('editModalComponent no está definido');
    }
  }




  // Eliminar venta seleccionada
  deleteProduct2(ventaId: string) {
    console.log('Eliminando venta con ID:', ventaId);
  
    if (confirm('¿Estás seguro de que deseas eliminar esta venta?')) {
      this.ventasService.deleteVentas(ventaId)
        .then(() => {
          console.log('Venta eliminada con éxito');
          this.loadVentasAndProducts(); // Recargar ventas después de eliminar
        })
        .catch(error => {
          console.error('Error al eliminar la venta:', error);
        });
    }
  }

  deleteProduct(ventaId: string, productId: string, quantity: number) {
    console.log('Eliminando venta con ID:', ventaId);
  
    // Verificar si el usuario está seguro de eliminar la venta
    if (confirm('¿Estás seguro de que deseas eliminar esta venta?')) {
      // Primero obtenemos el producto y su stock actual
      let subscription: Subscription | null = null;
  
      if (!subscription) {
        subscription = this.productService.getProductByIdOnce(productId).subscribe(
          (product: any) => {
            console.log('Producto recuperado:', product);
  
            // Verificar si el producto y su cantidad de stock son válidos
            if (product && product.data && product.data.stockQuantity !== undefined) {
              console.log('Stock del producto:', product.data.stockQuantity);
  
              // Calcular el nuevo stock
              const newStock = product.data.stockQuantity + quantity;
              console.log('Nuevo stock:', newStock);
  
              // Actualizar el stock en Firestore
              this.productService.updateProductStock2(productId, newStock).then(() => {
                console.log('Stock actualizado correctamente');
  
                // Ahora eliminar la venta del sistema
                this.ventasService.deleteVentas(ventaId)
                  .then(() => {
                    console.log('Venta eliminada con éxito');
                    this.loadVentasAndProducts(); // Recargar ventas después de eliminar
                  })
                  .catch(error => {
                    console.error('Error al eliminar la venta:', error);
                  });
              }).catch((error) => {
                console.error('Error al actualizar el stock:', error);
              });
            } else {
              console.error('Producto no encontrado o stock no válido');
            }
  
            // Desuscribir después de la consulta
            if (subscription) {
              subscription.unsubscribe();
              subscription = null;
            }
          },
          (error) => {
            console.error('Error al recuperar el producto:', error);
          }
        );
      } else {
        console.log('Ya hay una suscripción activa');
      }
    }
  }
  

  
// Eliminar venta seleccionada y restaurar el stock
deleteProduct3(ventaId: string, productId: string, quantity: number) {
  let subscription: Subscription | null = null;

  // Verificar si no hay una suscripción activa antes de realizar la consulta
  if (!subscription) {
    subscription = this.productService.getProductByIdOnce(productId).subscribe(
      (product: any) => {
        console.log('Producto recuperado:', product);

        // Verificar si el producto y su cantidad de stock son válidos
        if (product && product.data && product.data.stockQuantity !== undefined) {
          console.log('Stock del producto:', product.data.stockQuantity);

          const newStock = product.data.stockQuantity + quantity;
          console.log('Nuevo stock:', newStock);

          // Actualizar el stock en Firestore
          this.productService.updateProductStock2(productId, newStock).then(() => {
            console.log('Stock actualizado correctamente');
            // Desuscribir después de la primera actualización
            if (subscription) {
              subscription.unsubscribe();
              subscription = null; // Restablecer la variable de suscripción
            }
          }).catch((error) => {
            console.error('Error al actualizar el stock:', error);
          });
        } else {
          console.error('Producto no encontrado o stock no válido');
        }
      },
      (error) => {
        console.error('Error al recuperar el producto:', error);
      }
    );
  } else {
    console.log('Ya hay una suscripción activa');
  }
}

deleteProduct2f(ventaId: string, productId: string, quantity: number) {
  let subscription: Subscription | null = null;

if (!subscription) {
  subscription = this.productService.getProductById(productId).subscribe(
    (product: any) => {
      console.log('Producto recuperado:', product);

      if (product && product.data && product.data.stockQuantity !== undefined) {
        console.log('Stock del producto:', product.data.stockQuantity);

        const newStock = product.data.stockQuantity + quantity;
        console.log('Nuevo stock:', newStock);

        // Actualizar el stock en Firestore
        this.productService.updateProductStock2(productId, newStock).then(() => {
          console.log('Stock actualizado correctamente');
          // Desuscribir después de la primera actualización
          if (subscription) {
            subscription.unsubscribe();
            subscription = null; // Restablecer la variable de suscripción
          }
        }).catch((error) => {
          console.error('Error al actualizar el stock:', error);
        });
      } else {
        console.error('Producto no encontrado o stock no válido');
      }
    },
    (error) => {
      console.error('Error al recuperar el producto:', error);
    }
  );
} else {
  console.log('Ya hay una suscripción activa');
}


  
  
  

  
  

  
  

  
  
  
  
  
  
  
  
  
  
  
  
  
  
  



  

  
  

  
  
  
  
  

  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  





  
  

  
  
  
  
  

  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  

  
  
  

  
  
  
  
  
  
  
  
  
  
  
  
  
  
  


  
  
  
  
  

  
  
  
  
  

  
  
  

  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
}


deleteProduct8(ventaId: string, productId: string, quantity: number) {
  console.log('Eliminando venta con ID:', ventaId);

  if (confirm('¿Estás seguro de que deseas eliminar esta venta?')) {
    // Primero eliminar la venta
    this.ventasService.deleteVentas(ventaId)
      .then(() => {
        console.log('Venta eliminada con éxito');
        
        // Recuperar el producto para actualizar su stock
        return this.productService.getProductById(productId).toPromise();
      })
      .then((product: any) => {
        if (!product || !product.data || product.data.stockQuantity === undefined) {
          console.error('Producto no encontrado o stock no válido');
          throw new Error('Producto no encontrado o stock no válido');
        }

        console.log("Producto encontrado:", product);
        
        // Calcular el stock restaurado
        const currentStock = product.data.stockQuantity;
        const updatedStock = currentStock + quantity;

        console.log('Stock actual:', currentStock);
        console.log('Cantidad a restaurar:', quantity);
        console.log('Nuevo stock:', updatedStock);

        // Asegúrate de que el stock solo se actualiza si realmente ha cambiado
        if (updatedStock !== currentStock) {
          // Solo actualizar el stock si el valor es diferente
          return this.productService.updateProductStock(productId, updatedStock);
        } else {
          console.log('El stock no necesita actualización.');
          return Promise.resolve();
        }
      })
      .then(() => {
        console.log('Stock restaurado correctamente');
        // Recargar ventas y productos después de la eliminación
        this.loadVentasAndProducts();  // Recargar ventas y productos
      })
      .catch((error) => {
        console.error('Error al eliminar la venta o restaurar el stock:', error);
      });
  }
}




deleteProduct888(ventaId: string, productId: string, quantity: number) {
  console.log('Eliminando venta con ID:', ventaId);

  if (confirm('¿Estás seguro de que deseas eliminar esta venta?')) {
    // Eliminar la venta
    this.ventasService.deleteVentas(ventaId)
      .then(() => {
        console.log('Venta eliminada con éxito');
        
        // Recuperar el producto para actualizar su stock
        this.productService.getProductById(productId).subscribe(
          (product: any) => {
            console.log("Producto encontrado:", product);  // Mostrar todo el objeto del producto
            if (product && product.data) {
              console.log("Datos del producto:", product.data);
              
              // Asegurarse de que la cantidad a restaurar sea válida
              const quantityToRestore = quantity;  // Quantity debe ser positivo

              // Asegurarse de que quantityToRestore es un número positivo
              if (quantityToRestore <= 0) {
                console.error('La cantidad a restaurar debe ser mayor que cero');
                throw new Error('La cantidad a restaurar debe ser mayor que cero');
              }

              // Llamar a la función de aumento de stock
              return this.productService.increaseProductStock(productId, quantityToRestore);
            } else {
              console.error("ERROR: Datos del producto no válidos");
              throw new Error('Producto no encontrado o stock no válido');
            }
          },
          (error) => {
            console.error('Error al obtener el producto:', error);
            throw new Error('Error al obtener el producto');
          }
        );
      })
      .then(() => {
        console.log('Stock restaurado correctamente');
        // Recargar ventas y productos después de la eliminación
        // Asegurarse de que la recarga no desencadene un nuevo ciclo de eliminación
        this.loadVentasAndProducts();  // Recargar ventas y productos después de la eliminación
      })
      .catch((error) => {
        console.error('Error al eliminar la venta o restaurar el stock:', error);
      });
  }
}



deleteProduct222(ventaId: string, productId: string, quantity: number) {
  console.log('Eliminando venta con ID:', ventaId);

  if (confirm('¿Estás seguro de que deseas eliminar esta venta?')) {
    // Eliminar la venta
    this.ventasService.deleteVentas(ventaId)
      .then(() => {
        console.log('Venta eliminada con éxito');
        
        // Recuperar el producto para actualizar su stock
        this.productService.getProductById(productId).subscribe(
          (product: any) => {
            console.log("Producto encontrado:", product);  // Mostrar todo el objeto del producto
            if (product && product.data) {
              console.log("Datos del producto:", product.data);
              // Asegurarse de que la cantidad a restaurar sea válida
              const quantityToRestore = quantity;  // Quantity debe ser positivo

              // Asegurarse de que quantityToRestore es un número positivo
              if (quantityToRestore <= 0) {
                console.error('La cantidad a restaurar debe ser mayor que cero');
                throw new Error('La cantidad a restaurar debe ser mayor que cero');
              }

              // Llamar a la función de aumento de stock
              return this.productService.increaseProductStock(productId, quantityToRestore);
            } else {
              console.error("ERROR: Datos del producto no válidos");
              throw new Error('Producto no encontrado o stock no válido');
            }
          },
          (error) => {
            console.error('Error al obtener el producto:', error);
            throw new Error('Error al obtener el producto');
          }
        );
      })
      .then(() => {
        // Solo después de actualizar el stock, recargar la lista
        console.log('Stock restaurado correctamente');
        this.loadVentasAndProducts();  // Recargar ventas y productos después de la eliminación
      })
      .catch((error) => {
        console.error('Error al eliminar la venta o restaurar el stock:', error);
      });
  }
}


  // Abrir modal para añadir venta
  openAddVentaModal() {
    if (this.modalComponent) {
      this.modalComponent.open();
    } else {
      console.error('modalComponent no está definido');
    }
  }

  // Abrir modal para editar venta
  openEditVentaModal() {
    if (this.editModalComponent) {
      this.editModalComponent.open();
    } else {
      console.error('editModalComponent no está definido');
    }
  }
}
