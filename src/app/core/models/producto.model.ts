// Modelo que define la estructura de cada producto en la lista
export interface Producto {
  id: string;       // Identificador único
  name: string;     // Nombre del producto
  cat: string;      // ID de la categoría
  checked: boolean; // Si está en el carrito
  imp: boolean;     // Si es importante
  qty: number;      // Cantidad
  unit: string;     // Unidad (kg, litros, und, cajas)
  editing: boolean; // Si está en modo edición
}