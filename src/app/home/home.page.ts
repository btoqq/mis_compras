import { Component, OnInit, OnDestroy } from '@angular/core';
import {Subscription} from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { IonicModule } from '@ionic/angular';
import { StorageService } from '../core/services/storage.service';
import { Producto } from '../core/models/producto.model'; 
import { IonicStorageModule } from '@ionic/storage-angular';

const EMOJIS: { [key: string]: string } = {
  'Leche entera': '🥛', 'Leche descremada': '🥛', 'Leche semidescremada': '🥛',
  'Leche en polvo': '🥛', 'Leche de soya': '🥛', 'Queso amarillo': '🧀',
  'Queso blanco': '🧀', 'Queso mozzarella': '🧀', 'Mantequilla': '🧈',
  'Crema de leche': '🥛', 'Natilla': '🥛', 'Yogur natural': '🍶',
  'Yogur de fresa': '🍶', 'Yogur de vainilla': '🍶',
  'Huevos de gallina': '🥚', 'Huevos de codorniz': '🥚',
  'Pan blanco': '🍞', 'Pan integral': '🍞', 'Pan de caja': '🍞',
  'Tortillas': '🫓', 'Galletas': '🍪', 'Biscochos': '🍪',
  'Pollo entero': '🍗', 'Pechuga de pollo': '🍗', 'Muslos de pollo': '🍗',
  'Carne molida': '🥩', 'Bistec de res': '🥩', 'Costillas de cerdo': '🥩',
  'Chuleta de cerdo': '🥩', 'Salchicha': '🌭', 'Jamón': '🥩',
  'Tocino': '🥓', 'Chorizo': '🌭', 'Atún en lata': '🐟', 'Sardinas': '🐟',
  'Manzana': '🍎', 'Banano': '🍌', 'Naranja': '🍊', 'Mandarina': '🍊',
  'Piña': '🍍', 'Sandía': '🍉', 'Melón': '🍈', 'Uvas': '🍇',
  'Fresas': '🍓', 'Mango': '🥭', 'Papaya': '🍑', 'Pera': '🍐', 'Limón': '🍋',
  'Tomate': '🍅', 'Cebolla': '🧅', 'Papa': '🥔', 'Zanahoria': '🥕',
  'Lechuga': '🥬', 'Brócoli': '🥦', 'Pepino': '🥒', 'Chile dulce': '🫑',
  'Ajo': '🧄', 'Apio': '🌿', 'Espinaca': '🥬', 'Remolacha': '🫚',
  'Aguacate': '🥑',
  'Arroz': '🍚', 'Frijoles': '🫘', 'Azúcar': '🍬', 'Sal': '🧂',
  'Aceite': '🫙', 'Harina': '🌾', 'Pasta': '🍝', 'Lentejas': '🫘',
  'Avena': '🌾', 'Maíz': '🌽', 'Vinagre': '🫙', 'Salsa de tomate': '🍅',
  'Mayonesa': '🫙', 'Mostaza': '🫙',
  'Detergente en polvo': '🧺', 'Detergente líquido': '🧴', 'Suavizante': '🧴',
  'Cloro': '🧴', 'Limpiapisos': '🧹', 'Jabón de trastos': '🧼',
  'Esponja': '🧽', 'Escoba': '🧹', 'Trapeador': '🧹',
  'Bolsas de basura': '🗑️', 'Desinfectante': '🧴', 'Papel higiénico': '🧻',
  'Servilletas': '🧻', 'Papel toalla': '🧻',
  'Shampoo': '🧴', 'Acondicionador': '🧴', 'Jabón de baño': '🧼',
  'Pasta de dientes': '🪥', 'Cepillo de dientes': '🪥', 'Desodorante': '🧴',
  'Rastrillos': '🪒', 'Crema corporal': '🧴', 'Protector solar': '🧴',
  'Agua': '💧', 'Jugo de naranja': '🍊', 'Jugo de piña': '🍍',
  'Refresco cola': '🥤', 'Refresco de uva': '🥤', 'Té': '🍵',
  'Café molido': '☕', 'Café instantáneo': '☕', 'Chocolate en polvo': '🍫',
  'Concentrado perro': '🐶', 'Concentrado gato': '🐱',
  'Arena para gato': '🐱', 'Snacks para perro': '🐶', 'Snacks para gato': '🐱',
  'Helado de vainilla': '🍦', 'Helado de chocolate': '🍫',
  'Pizza congelada': '🍕', 'Nuggets': '🍗', 'Papas fritas congeladas': '🍟',
  'Vegetales congelados': '🥦',
  'Papas fritas': '🍟', 'Palomitas': '🍿', 'Galletas dulces': '🍪',
  'Galletas saladas': '🍘', 'Chocolates': '🍫', 'Chicles': '🍬', 'Gomitas': '🍬',
  'Queso crema': '🧀', 'Queso parmesano': '🧀',
  'Leche condensada': '🥛', 'Dulce de leche': '🍮',
  'Acetaminofén': '💊', 'Ibuprofeno': '💊', 'Antigripal': '💊',
  'Vitamina C': '💊', 'Alcohol': '🧴', 'Curitas': '🩹', 'Algodón': '🩹'
};

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
export class HomePage implements OnInit, OnDestroy {

  // ── DATOS DE LA LISTA ──────────────────────────────────────

  items: Producto[] = [];          // Lista de productos agregados por el usuario
  categorias: any[] = [];          // Categorías del catálogo precargado
  filtro: string = 'all';          // Filtro activo: all | pend | imp | done
  busqueda: string = '';           // Texto de búsqueda actual
  pendientes: any[] = [];          // Productos seleccionados en el modal antes de confirmar
  private listaSub: Subscription | undefined;    

  // ── MODAL ──────────────────────────────────────────────────
  modalAbierto: boolean = false; // Controla si el modal está visible o no
  sugerencias: any[] = []; // Lista de sugerencias al buscar 

  // Busca productos en el catálogo que coincidan con la búsqueda
buscarSugerencias() {
  if (!this.busqueda.trim()) { this.sugerencias = []; return; }
  const q = this.busqueda.toLowerCase();
  this.sugerencias = [];
  this.categorias.forEach(cat => {
    cat.productos.forEach((prod: string) => {
      if (prod.toLowerCase().includes(q)) {
        this.sugerencias.push({
          nombre: prod,
          catId: cat.id,
          catNombre: cat.n
        });
      }
    });
  });
}

// Agrega un producto directamente desde la búsqueda
async agregarDesdeBusqueda(s: any) {
  if (this.yaEnLista(s.nombre)) return;
  this.items.push({
    id: this.storageService.generarId(),
    name: s.nombre,
    cat: s.catId,
    checked: false,
    imp: false,
    qty: 1,
    unit: 'und',
    editing: false
  });
  await this.guardar();
}

  constructor(
    private storageService: StorageService,  // Para guardar y cargar la lista
    private http: HttpClient                 // Para leer el catalogo.json
  ) {}

  // Devuelve el emoji individual del producto en el modal
getEmojiModal(nombre: string): string {
  return EMOJIS[nombre] || '🛒';
}

  // Se ejecuta automáticamente cuando la página carga
  async ngOnInit() {
    await this.cargarCatalogo();    // Primero carga los productos del JSON
    this.listaSub = this.storageService.lista$.subscribe(items => {
      this.items = [...items];
    });     // Luego carga la lista guardada del usuario
  }

  ngOnDestroy() {
      this.listaSub?.unsubscribe();
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