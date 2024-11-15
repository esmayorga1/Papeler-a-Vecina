import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VentasService {

  constructor(private firestore: AngularFirestore ) {}

  // =====================Agregar Nuevo Venta====================
  addVenta(product: any): Promise<any> {
    return this.firestore.collection('ventas').add(product);
  }


  // =================== Obtener ventas ================================
  getVentas(): Observable<any[]> {
    return this.firestore.collection('ventas').snapshotChanges().pipe(
      map(actions => 
        actions.map(a => {
          const data = a.payload.doc.data();  
          const id = a.payload.doc.id;        
          return { id, data };      
        })
      )
    );
  }


  getProductById(productId: string): Observable<any> {
    return this.firestore.collection('productos').doc(productId).valueChanges();
  }
    
  // =================== Editar venta ================================
    
  updateVentas(ventaId: string, updatedProduct: any) {
    return this.firestore.collection('ventas').doc(ventaId).update(updatedProduct);
  }
    
  // =================== Eliminar Venta ================================
    
  deleteVentas(ventaId: string): Promise<void> {
    return this.firestore.collection('ventas').doc(ventaId).delete();
  }


  // =================== Obtener ventas por rango de fechas ================================
  getVentasByDateRange(startDate: string, endDate: string): Observable<any[]> {
    return this.firestore
      .collection('ventas', ref =>
        ref
          .where('date', '>=', startDate)
          .where('date', '<=', endDate)
          .orderBy('date')
      )
      .snapshotChanges()
      .pipe(
        map(actions => 
          actions.map(a => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;        
            return { id, data };      
          })
        )
      );
  }

  // =================== Obtener ventas por un día específico ================================
  getVentasByDay(date: string): Observable<any[]> {
    return this.firestore
      .collection('ventas', ref =>
        ref
          .where('date', '==', date)
          .orderBy('date')
      )
      .snapshotChanges()
      .pipe(
        map(actions => 
          actions.map(a => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;        
            return { id, data };      
          })
        )
      );
  }

  getTotalVentas(): Observable<number> {
    return this.firestore.collection('ventas').snapshotChanges().pipe(
      map(actions => actions.length) // Contamos la cantidad de registros (documentos)
    );
  }
  
  
  
  


}
