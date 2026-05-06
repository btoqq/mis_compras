import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { IonicModule } from '@ionic/angular';
import { StorageService } from '../core/services/storage.service';
import { Producto } from '../core/models/producto.model'; 
import { IonicStorageModule } from '@ionic/storage-angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    CommonModule,   // Directivas básicas de Angular
    FormsModule,    // Manejo de formularios
    IonicModule,
    IonicStorageModule    // Componentes de Ionic
  ],
})
export class HomePage implements OnInit {

  // ── DATOS DE LA LISTA ──────────────────────────────────────

  items: Producto[] = [];          // Lista de productos agregados por el usuario
  categorias: any[] = [];          // Categorías del catálogo precargado
  filtro: string = 'all';          // Filtro activo: all | pend | imp | done
  busqueda: string = '';           // Texto de búsqueda actual
  pendientes: any[] = [];          // Productos seleccionados en el modal antes de confirmar

  // ── MODAL ──────────────────────────────────────────────────
  modalAbierto: boolean = false;   // Controla si el modal está visible o no

  constructor(
    private storageService: StorageService,  // Para guardar y cargar la lista
    private http: HttpClient                 // Para leer el catalogo.json
  ) {}

  // Se ejecuta automáticamente cuando la página carga
  async ngOnInit() {
    await this.cargarCatalogo();   // Primero carga los productos del JSON
    await this.cargarLista();      // Luego carga la lista guardada del usuario
  }

  // ── CARGA DE DATOS ──────────────────────────────────────────

  // Lee el catalogo.json y guarda las categorías
  cargarCatalogo() {
    return new Promise<void>(resolve => {
      this.http.get<any>('assets/data/catalogo.json').subscribe(data => {
        this.categorias = data.categorias;
        resolve();
      });
    });
  }

  // Carga la lista guardada en el dispositivo
  async cargarLista() {
    this.items = await this.storageService.cargarLista();
  }

  // Guarda la lista actual en el dispositivo
  async guardar() {
    await this.storageService.guardarLista(this.items);
  }

  // ── CONTADOR ────────────────────────────────────────────────

  // Devuelve cuántos productos están marcados como "en carrito"
  get enCarrito(): number {
    return this.items.filter(p => p.checked).length;
  }

  // Devuelve el total de productos en la lista
  get totalItems(): number {
    return this.items.length;
  }

  // ── FILTROS Y BÚSQUEDA ──────────────────────────────────────

  // Cambia el filtro activo (Todos, Pendientes, Importantes, En carrito)
  setFiltro(f: string) {
    this.filtro = f;
  }

  // Devuelve la lista filtrada y buscada para mostrar en pantalla
  get itemsFiltrados(): Producto[] {
    let lista = [...this.items];

    // Aplica el filtro de chips
    if (this.filtro === 'pend') lista = lista.filter(p => !p.checked);
    if (this.filtro === 'imp')  lista = lista.filter(p => p.imp);
    if (this.filtro === 'done') lista = lista.filter(p => p.checked);

    // Aplica la búsqueda por texto
    if (this.busqueda.trim()) {
      const q = this.busqueda.toLowerCase();
      lista = lista.filter(p => p.name.toLowerCase().includes(q));
    }

    // Ordena: importantes primero, luego pendientes, luego en carrito
    return lista.sort((a, b) => {
      if (a.imp && !b.imp) return -1;
      if (!a.imp && b.imp) return 1;
      if (!a.checked && b.checked) return -1;
      if (a.checked && !b.checked) return 1;
      return 0;
    });
  }

  // ── ACCIONES DE PRODUCTO ────────────────────────────────────

  // Marca o desmarca un producto como "en carrito"
  async toggleChecked(id: string) {
    const p = this.items.find(x => x.id === id);
    if (p) {
      p.checked = !p.checked;
      p.editing = false;
      await this.guardar();
    }
  }

  // Marca o desmarca un producto como "importante"
  async toggleImportante(id: string) {
    const p = this.items.find(x => x.id === id);
    if (p) {
      p.imp = !p.imp;
      await this.guardar();
    }
  }

  // Elimina un producto de la lista
  async eliminarProducto(id: string) {
    this.items = this.items.filter(x => x.id !== id);
    await this.guardar();
  }

  // Abre el editor de cantidad de un producto
  abrirEditor(id: string) {
    this.items.forEach(p => p.editing = false); // Cierra cualquier editor abierto
    const p = this.items.find(x => x.id === id);
    if (p) p.editing = true;
  }

  // Guarda los cambios de cantidad y unidad de un producto
  async guardarEdicion(id: string, qty: number, unit: string) {
    const p = this.items.find(x => x.id === id);
    if (p) {
      p.qty = Math.max(1, Math.min(999, qty || 1)); // Mínimo 1, máximo 999
      p.unit = unit;
      p.editing = false;
      await this.guardar();
    }
  }

  // Cancela la edición sin guardar cambios
  cancelarEdicion(id: string) {
    const p = this.items.find(x => x.id === id);
    if (p) p.editing = false;
  }

  // ── MODAL ───────────────────────────────────────────────────

  // Abre el modal de agregar productos
  abrirModal() {
    this.pendientes = [];
    this.modalAbierto = true;
  }

  // Cierra el modal sin agregar nada
  cerrarModal() {
    this.modalAbierto = false;
    this.pendientes = [];
  }

  // Selecciona o deselecciona un producto en el modal
  togglePendiente(nombre: string, catId: string) {
    const i = this.pendientes.findIndex(x => x.name === nombre);
    if (i > -1) {
      this.pendientes.splice(i, 1);  // Si ya estaba, lo quita
    } else {
      this.pendientes.push({ name: nombre, cat: catId }); // Si no, lo agrega
    }
  }

  // Verifica si un producto está seleccionado en el modal
  esPendiente(nombre: string): boolean {
    return this.pendientes.some(x => x.name === nombre);
  }

  // Verifica si un producto ya está en la lista del usuario
  yaEnLista(nombre: string): boolean {
    return this.items.some(x => x.name === nombre);
  }

  // Confirma la selección y agrega los productos a la lista
  async confirmarModal() {
    if (!this.pendientes.length) { this.cerrarModal(); return; }
    this.pendientes.forEach(p => {
      this.items.push({
        id: this.storageService.generarId(), // ID único
        name: p.name,
        cat: p.cat,
        checked: false,   // Empieza sin marcar
        imp: false,        // Empieza sin ser importante
        qty: 1,            // Cantidad inicial: 1
        unit: 'und',       // Unidad inicial: unidades
        editing: false     // No está en modo edición
      });
    });
    await this.guardar();
    this.cerrarModal();
  }

  // Devuelve el emoji del producto buscando en el catálogo
  getEmoji(catId: string): string {
    const cat = this.categorias.find(c => c.id === catId);
    return cat ? cat.e : '🛒';
  }

  // Devuelve el nombre de la categoría
  getNombreCat(catId: string): string {
    const cat = this.categorias.find(c => c.id === catId);
    return cat ? cat.n : catId;
  }

  // Limpia el texto de búsqueda
  limpiarBusqueda() {
    this.busqueda = '';
  }
}