import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductServiceService {

  constructor(private firestore: AngularFirestore) {}

  // =====================Agregar Nuevo Producto====================

  addProduct(product: any): Promise<any> {
    return this.firestore.collection('products').add(product);
  }

  // =================== Obtener Producto ================================

  getProducts1(): Observable<any[]> {
    return this.firestore.collection('products').snapshotChanges().pipe(
      map(actions => 
        actions.map(a => {
          const data = a.payload.doc.data();  
          const id = a.payload.doc.id;        
          return { id, data };      
        })
      )
    );
  }
  
  // =================== Editar Producto ================================
  
  updateProduct(productId: string, updatedProduct: any) {
    return this.firestore.collection('products').doc(productId).update(updatedProduct);
  }
  

   // =================== Eliminar Producto ================================
  
  deleteProduct(productId: string): Promise<void> {
    return this.firestore.collection('products').doc(productId).delete();
  }
}
