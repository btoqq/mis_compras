// Página de categorías - muestra el catálogo organizado por categorías

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { StorageService, } from '../../core/services/storage.service';
import { Producto } from '../../core/models/producto.model';

// Mapa de emojis individuales por producto
const EMOJIS: { [key: string]: string } = {
  // Lácteos
  'Leche entera': '🥛', 'Leche descremada': '🥛', 'Leche semidescremada': '🥛',
  'Leche en polvo': '🥛', 'Leche de soya': '🥛', 'Queso amarillo': '🧀',
  'Queso blanco': '🧀', 'Queso mozzarella': '🧀', 'Mantequilla': '🧈',
  'Crema de leche': '🥛', 'Natilla': '🥛', 'Yogur natural': '🍶',
  'Yogur de fresa': '🍶', 'Yogur de vainilla': '🍶',
  // Huevos
  'Huevos de gallina': '🥚', 'Huevos de codorniz': '🥚',
  // Panadería
  'Pan blanco': '🍞', 'Pan integral': '🍞', 'Pan de caja': '🍞',
  'Tortillas': '🫓', 'Galletas': '🍪', 'Biscochos': '🍪',
  // Carnes
  'Pollo entero': '🍗', 'Pechuga de pollo': '🍗', 'Muslos de pollo': '🍗',
  'Carne molida': '🥩', 'Bistec de res': '🥩', 'Costillas de cerdo': '🥩',
  'Chuleta de cerdo': '🥩', 'Salchicha': '🌭', 'Jamón': '🥩',
  'Tocino': '🥓', 'Chorizo': '🌭', 'Atún en lata': '🐟', 'Sardinas': '🐟',
  // Frutas
  'Manzana': '🍎', 'Banano': '🍌', 'Naranja': '🍊', 'Mandarina': '🍊',
  'Piña': '🍍', 'Sandía': '🍉', 'Melón': '🍈', 'Uvas': '🍇',
  'Fresas': '🍓', 'Mango': '🥭', 'Papaya': '🍈', 'Pera': '🍐', 'Limón': '🍋',
  // Verduras
  'Tomate': '🍅', 'Cebolla': '🧅', 'Papa': '🥔', 'Zanahoria': '🥕',
  'Lechuga': '🥬', 'Brócoli': '🥦', 'Pepino': '🥒', 'Chile dulce': '🫑',
  'Ajo': '🧄', 'Apio': '🌿', 'Espinaca': '🥬', 'Remolacha': '🫚',
  'Aguacate': '🥑',
  // Abarrotes
  'Arroz': '🍚', 'Frijoles': '🫘', 'Azúcar': '🍬', 'Sal': '🧂',
  'Aceite': '🫙', 'Harina': '🌾', 'Pasta': '🍝', 'Lentejas': '🫘',
  'Avena': '🌾', 'Maíz': '🌽', 'Vinagre': '🫙', 'Salsa de tomate': '🍅',
  'Mayonesa': '🫙', 'Mostaza': '🫙',
  // Limpieza
  'Detergente en polvo': '🧺', 'Detergente líquido': '🧴', 'Suavizante': '🧴',
  'Cloro': '🧴', 'Limpiapisos': '🧹', 'Jabón de trastos': '🧼',
  'Esponja': '🧽', 'Escoba': '🧹', 'Trapeador': '🧹',
  'Bolsas de basura': '🗑️', 'Desinfectante': '🧴', 'Papel higiénico': '🧻',
  'Servilletas': '🧻', 'Papel toalla': '🧻',
  // Cuidado personal
  'Shampoo': '🧴', 'Acondicionador': '🧴', 'Jabón de baño': '🧼',
  'Pasta de dientes': '🪥', 'Cepillo de dientes': '🪥', 'Desodorante': '🧴',
  'Rastrillos': '🪒', 'Crema corporal': '🧴', 'Protector solar': '🧴',
  // Bebidas
  'Agua': '💧', 'Jugo de naranja': '🍊', 'Jugo de piña': '🍍',
  'Refresco cola': '🥤', 'Refresco de uva': '🥤', 'Té': '🍵',
  'Café molido': '☕', 'Café instantáneo': '☕', 'Chocolate en polvo': '🍫',
  // Mascotas
  'Concentrado perro': '🐶', 'Concentrado gato': '🐱',
  'Arena para gato': '🐱', 'Snacks para perro': '🐶', 'Snacks para gato': '🐱',
  // Congelados
  'Helado de vainilla': '🍦', 'Helado de chocolate': '🍫',
  'Pizza congelada': '🍕', 'Nuggets': '🍗', 'Papas fritas congeladas': '🍟',
  'Vegetales congelados': '🥦',
  // Snacks
  'Papas fritas': '🍟', 'Palomitas': '🍿', 'Galletas dulces': '🍪',
  'Galletas saladas': '🍘', 'Chocolates': '🍫', 'Chicles': '🍬', 'Gomitas': '🍬',
  // Lácteos adicionales
  'Queso crema': '🧀', 'Queso parmesano': '🧀',
  'Leche condensada': '🥛', 'Dulce de leche': '🍮',
  // Farmacia
  'Acetaminofén': '💊', 'Ibuprofeno': '💊', 'Antigripal': '💊',
  'Vitamina C': '💊', 'Alcohol': '🧴', 'Curitas': '🩹', 'Algodón': '🩹'
};

@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.page.html',
  styleUrls: ['./categorias.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, HttpClientModule]
})

export class CategoriasPage implements OnInit {

  categorias: any[] = [];           // Lista de todas las categorías del catálogo
  categoriaAbierta: any = null;     // Categoría actualmente expandida, null = ninguna
  items: Producto[] = [];           // Lista actual del usuario para saber qué ya agregó

  constructor(
    private http: HttpClient,               // Para leer el catalogo.json
    private storageService: StorageService  // Para cargar la lista del usuario
  ) {}

  // Devuelve el emoji individual del producto
getEmojiProducto(nombre: string): string {
  return EMOJIS[nombre] || '🛒';
}

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