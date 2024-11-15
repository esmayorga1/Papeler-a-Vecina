import { Component, OnInit } from '@angular/core';
import { VentasService } from '../../../services/ventas.service';
import { ProductServiceService } from '../../../services/product-service.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.css']
})
export class ReportesComponent implements OnInit {
  noVentas = false; 
  ventas: any[] = [];
  startDate: string = '';
  endDate: string = '';
  selectedDate: string = '';
  gananciasTotales: number = 0;
  resumenVentas: any[] = [];
  processedProducts: Set<string> = new Set(); // Set para evitar duplicados

  constructor(
    private ventasService: VentasService,
    private productService: ProductServiceService
  ) {}

  ngOnInit(): void {}

  // ============ Obtener ventas por rango de fechas==================
  obtenerVentasPorRango(): void {
    if (this.startDate && this.endDate) {
      this.ventasService.getVentasByDateRange(this.startDate, this.endDate).subscribe((ventas) => {
        this.ventas = ventas;
        this.generarResumenVentas(); 
        this.noVentas = this.ventas.length === 0;
      });
    } else {
      this.noVentas = true; 
    }
  }

  // =============Obtener ventas por un día específico==================
  obtenerVentasPorDia(): void {
    if (this.selectedDate) {
      this.ventasService.getVentasByDay(this.selectedDate).subscribe((ventas) => {
        this.ventas = ventas;
        this.generarResumenVentas(); 
        this.noVentas = this.ventas.length === 0;
      });
    } else {
      this.noVentas = true; 
    }
  }

  // =================== Generar el resumen de ventas y calcular ganancias==============================
  generarResumenVentas(): void {
    this.resumenVentas = []; 
    this.gananciasTotales = 0;

    // Limpiar el conjunto de productos procesados antes de comenzar
    this.processedProducts.clear();

    this.ventas.forEach((venta) => {
      const { productId, quantity, total, date } = venta.data;

      // Verificar si el producto ya fue procesado
      if (!this.processedProducts.has(productId)) {
        // Si no ha sido procesado, agregar al conjunto y procesar

        this.productService.getProductById(productId).subscribe((productData) => {
          const productName = productData.data.name;
          const purchasePrice = productData.data.purchasePrice;
          const salePrice = productData.data.salePrice;

          // Calcular la ganancia por producto
          const ganancia = (salePrice - purchasePrice) * quantity;

          // Agregar el producto al resumen
          this.resumenVentas.push({
            date,
            productName,
            purchasePrice,
            salePrice,
            totalCantidad: quantity,
            totalGanancia: ganancia,
          });

          // Añadir el producto al conjunto de productos procesados
          this.processedProducts.add(productId);

          // Actualizar las ganancias totales
          this.gananciasTotales += ganancia;
        });
      }
    });
  }

  totalGanancia() {
    return this.gananciasTotales;
  }
}
