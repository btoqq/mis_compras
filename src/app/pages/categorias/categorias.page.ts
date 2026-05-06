// Página de categorías - muestra el catálogo organizado por categorías

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { StorageService, } from '../../core/services/storage.service';
import { Producto } from '../../core/models/producto.model';

@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.page.html',
  styleUrls: ['./categorias.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule]
})
export class CategoriasPage implements OnInit {

  categorias: any[] = [];           // Lista de todas las categorías del catálogo
  categoriaAbierta: any = null;     // Categoría actualmente expandida, null = ninguna
  items: Producto[] = [];           // Lista actual del usuario para saber qué ya agregó

  constructor(
    private http: HttpClient,               // Para leer el catalogo.json
    private storageService: StorageService  // Para cargar la lista del usuario
  ) {}

  async ngOnInit() {
    await this.cargarCatalogo();  // Carga las categorías al abrir la página
    await this.cargarLista();     // Carga la lista del usuario
  }

  // Lee el catalogo.json y guarda las categorías
  cargarCatalogo() {
    return new Promise<void>(resolve => {
      this.http.get<any>('assets/data/catalogo.json').subscribe(data => {
        this.categorias = data.categorias;
        resolve();
      });
    });
  }

  // Carga la lista guardada del usuario
  async cargarLista() {
    this.items = await this.storageService.cargarLista();
  }

  // Abre o cierra una categoría
  toggleCategoria(cat: any) {
    // Si la categoría ya está abierta la cierra, si no la abre
    this.categoriaAbierta = this.categoriaAbierta?.id === cat.id ? null : cat;
  }

  // Verifica si un producto ya está en la lista del usuario
  yaEnLista(nombre: string): boolean {
    return this.items.some(x => x.name === nombre);
  }

  // Agrega un producto directamente desde la vista de categorías
  async agregarProducto(nombre: string, catId: string) {
    if (this.yaEnLista(nombre)) return; // Si ya está no lo agrega de nuevo
    this.items.push({
      id: this.storageService.generarId(),
      name: nombre,
      cat: catId,
      checked: false,
      imp: false,
      qty: 1,
      unit: 'und',
      editing: false
    });
    await this.storageService.guardarLista(this.items);
  }

  // Cierra la categoría abierta
  cerrarCategoria() {
    this.categoriaAbierta = null;
  }
}