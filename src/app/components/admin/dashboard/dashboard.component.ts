import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductServiceService } from '../../../services/product-service.service';
import { VentasService } from '../../../services/ventas.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  totalProducts: number = 0;
  lowStockProducts: number = 0;
  lowStockProductsList: any[] = [];  // Lista de productos con stock bajo
  top5Products: any = [];  // Lista de los 5 productos más vendidos
  bottom5Products: any = [];  // Lista de los 5 productos menos vendidos
  totalVentas: number = 0;

  constructor(
    private productService: ProductServiceService,
    private ventasService: VentasService
  ) {}

  ngOnInit(): void {
    // Primero cargamos los productos
    this.loadProductData();
  }

  loadProductData(): void {
    // Obtener los productos
    this.productService.getProducts1().subscribe(products => {
      // Al obtener los productos, calculamos los totales de productos
      this.totalProducts = products.length;

      // Filtramos productos con stock bajo
      this.lowStockProductsList = products.filter(product => product.data.stockQuantity < 10);
      this.lowStockProducts = this.lowStockProductsList.length;

      // Ahora que tenemos los productos, cargamos las ventas
      this.loadVentasData(products);
    });
  }

  loadVentasData(products: any[]): void {
    // Obtener las ventas
    this.ventasService.getVentas().subscribe(ventas => {
      // Establecer el total de ventas
      this.loadTotalVentas();

      // Procesar las ventas y calcular el top 5 y bottom 5
      this.loadTop5AndBottom5Products(products, ventas);
    });
  }

  loadTotalVentas(): void {
    // Obtener el total de ventas
    this.ventasService.getTotalVentas().subscribe(total => {
      this.totalVentas = total;
    });
  }

  loadTop5AndBottom5Products(products: any[], ventas: any[]): void {
    // Crear un objeto para almacenar las ventas por producto
    const salesMap: { [key: string]: number } = {};

    // Sumar las cantidades vendidas por cada producto
    ventas.forEach(venta => {
      const productId = venta.data.productId;
      const quantity = venta.data.quantity;

      if (salesMap[productId]) {
        salesMap[productId] += quantity;
      } else {
        salesMap[productId] = quantity;
      }
    });

    // Crear un array con el total de ventas por producto
    const productSales = Object.keys(salesMap).map(productId => ({
      productId,
      sales: salesMap[productId]
    }));

    // Ordenar productos por ventas (de mayor a menor)
    const topProducts = productSales.sort((a, b) => b.sales - a.sales).slice(0, 5);

    // Ordenar productos por ventas (de menor a mayor)
    const bottomProducts = productSales.sort((a, b) => a.sales - b.sales).slice(0, 5);

    // Mapear productos con nombre y ventas
    this.top5Products = topProducts.map(product => {
      const productData = products.find(p => p.data.id === product.productId);
      const productName = productData ? productData.data.name : 'Producto no encontrado';
      return { name: productName, sales: product.sales };
    });

    this.bottom5Products = bottomProducts.map(product => {
      const productData = products.find(p => p.data.id === product.productId);
      const productName = productData ? productData.data.name : 'Producto no encontrado';
      return { name: productName, sales: product.sales };
    });
  }
}
