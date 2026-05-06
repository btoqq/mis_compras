import { Injectable, inject } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Producto } from '../models/producto.model';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private readonly KEY = 'mis_compras_lista';
  
  // Usamos inject() que es más estable en Angular 18/19/20
  private storageControl = inject(Storage); 
  private _db: Storage | null = null;

  constructor() {
    this.init();
  }

  async init() {
    // Esto crea la conexión real
    this._db = await this.storageControl.create();
  }

  async guardarLista(items: Producto[]): Promise<void> {
    // Si la DB aún no carga, esperamos un poco
    if (!this._db) await this.init();
    await this._db?.set(this.KEY, JSON.stringify(items));
  }

  async cargarLista(): Promise<Producto[]> {
    if (!this._db) await this.init();
    const data = await this._db?.get(this.KEY);
    return data ? JSON.parse(data) : [];
  }

  async borrarLista(): Promise<void> {
    if (!this._db) await this.init();
    await this._db?.remove(this.KEY);
  }

  generarId(): string {
    return Date.now().toString(36) + Math.random().toString(36).slice(2);
  }
}