import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Producto } from '../models/producto.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  private readonly KEY = 'mis_compras_lista';

  // Canal de comunicación entre páginas - cuando cambia la lista todas las páginas se enteran
  private listaSubject = new BehaviorSubject<Producto[]>([]);
  lista$ = this.listaSubject.asObservable();

  constructor(private storage: Storage) {
    this.storage.create().then(() => {
      this.cargarLista().then(items => this.listaSubject.next(items));
    });
  }

  // Guarda la lista y notifica a todas las páginas
  async guardarLista(items: Producto[]): Promise<void> {
    await this.storage.set(this.KEY, JSON.stringify(items));
    this.listaSubject.next(items); // Notifica a todas las páginas
  }

  // Carga la lista guardada
  async cargarLista(): Promise<Producto[]> {
    const data = await this.storage.get(this.KEY);
    return data ? JSON.parse(data) : [];
  }

  // Borra toda la lista
  async borrarLista(): Promise<void> {
    await this.storage.remove(this.KEY);
    this.listaSubject.next([]);
  }

  // Genera un ID único
  generarId(): string {
    return Date.now().toString(36) + Math.random().toString(36).slice(2);
  }

  private readonly KEY_CUSTOM = 'mis_compras_custom'; // Llave para productos personalizados

// Guarda un producto personalizado en el catálogo
async guardarProductoCustom(nombre: string, catId: string, emoji: string): Promise<void> {
  const custom = await this.cargarProductosCustom();
  custom.push({ nombre, catId, emoji });
  await this.storage.set(this.KEY_CUSTOM, JSON.stringify(custom));
}

// Carga todos los productos personalizados
async cargarProductosCustom(): Promise<any[]> {
  const data = await this.storage.get(this.KEY_CUSTOM);
  return data ? JSON.parse(data) : [];
}
}

