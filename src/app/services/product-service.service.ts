import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductServiceService {

  constructor(private firestore: AngularFirestore) {}

  // Función para agregar un nuevo producto
  addProduct(product: any): Promise<any> {
    return this.firestore.collection('products').add(product);
  }

  // Función para obtener todos los productos
  // getProducts1(): Observable<any[]> {
    // return this.firestore.collection('products').valueChanges();
  // }


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

  getProducts(): Observable<any[]> {
    return this.firestore.collection('products').valueChanges();
  }
  
  

  // Función para editar un producto
  updateProduct(id: string, product: any): Promise<void> {
    return this.firestore.collection('products').doc(id).update(product);
  }

  // Función para eliminar un producto
  

  deleteProduct(productId: string): Promise<void> {
    return this.firestore.collection('products').doc(productId).delete();
  }
}
