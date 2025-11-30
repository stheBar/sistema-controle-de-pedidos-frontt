// src/app/modules/shared/shared.module.ts

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';


// Angular Material (Todos os módulos utilizados)
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import {MenuPrincipalComponent} from './menu-principal/menu-principal'; // Adicionando caso seja útil

@NgModule({
  // NENHUMA DECLARAÇÃO, pois o MenuPrincipalComponent é standalone
  imports: [
    CommonModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,

    // Importa o componente standalone AQUI
    MenuPrincipalComponent,

    // Módulos do Material
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    MatButtonModule,
    MatDividerModule,
    MatCardModule
  ],
  exports: [
    // Exporta o componente standalone AQUI
    MenuPrincipalComponent,

    // Reexporta módulos comuns e do Material
    CommonModule,
    RouterModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    MatButtonModule,
    MatDividerModule,
    MatCardModule
  ]
})
export class SharedModule { }
