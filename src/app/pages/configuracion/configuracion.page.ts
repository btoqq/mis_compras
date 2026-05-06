// Página de configuración - maneja el login con Google y ajustes de la app

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-configuracion',
  templateUrl: './configuracion.page.html',
  styleUrls: ['./configuracion.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule]
})
export class ConfiguracionPage implements OnInit {

  // Controla si el usuario está logueado con Google
  usuarioLogueado: boolean = false;

  // Datos del usuario cuando está logueado
  usuario = {
    nombre: '',
    email: '',
    foto: ''
  };

  constructor() {}

  ngOnInit() {}

  // Simula el login con Google (lo conectaremos con Google Auth después)
  async loginGoogle() {
    // Por ahora simulamos un login exitoso
    this.usuarioLogueado = true;
    this.usuario = {
      nombre: 'Usuario',
      email: 'usuario@gmail.com',
      foto: ''
    };
  }

  // Cierra la sesión del usuario
  cerrarSesion() {
    this.usuarioLogueado = false;
    this.usuario = { nombre: '', email: '', foto: '' };
  }
}