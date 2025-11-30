import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MenuPrincipalComponent } from '../../sharedComponents/menu-principal/menu-principal';

@Component({
  standalone: true,
  selector: 'app-home',
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
  imports: [
    CommonModule,
    MatCardModule,
    MenuPrincipalComponent
  ]
})
export class HomeComponent {}
