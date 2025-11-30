
import {
  Component,
  OnInit,
  ViewChild,
  HostListener,
  AfterViewInit
} from '@angular/core';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';

import { CommonModule, TitleCasePipe } from '@angular/common';
import { RouterModule } from '@angular/router';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';

import { AuthService } from '../../../core/services/auth.service';

interface MenuItem {
  label: string;
  icon: string;
  route: string;
  roles?: string[];
}

@Component({
  selector: 'app-menu-principal',
  templateUrl: './menu-principal.html',
  styleUrls: ['./menu-principal.css'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    MatButtonModule,
    MatDividerModule,
    TitleCasePipe
  ]
})
export class MenuPrincipalComponent implements OnInit, AfterViewInit {
  @ViewChild('sidenav') sidenav!: MatSidenav;

  menuItems: MenuItem[] = [];
  isMobile = false;
  sidenavMode: 'side' | 'over' = 'side';

  private resizeTimeout: any;

  constructor(public authService: AuthService) {}

  ngOnInit(): void {
    this.loadMenuItems();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.updateSidenavMode();
    });
  }


  @HostListener('window:resize')
  onResize() {
    clearTimeout(this.resizeTimeout);
    this.resizeTimeout = setTimeout(() => {
      this.updateSidenavMode();
    }, 120);
  }

  private updateSidenavMode() {
    this.isMobile = window.innerWidth < 768;
    this.sidenavMode = this.isMobile ? 'over' : 'side';

    if (this.isMobile && this.sidenav?.opened) {
      this.sidenav.close();
    }

    if (!this.isMobile && !this.sidenav?.opened) {
      this.sidenav.open();
    }
  }

  onMenuItemClick() {
    if (this.isMobile) {
      this.sidenav.close();
    }
  }

  loadMenuItems(): void {
    const allMenuItems: MenuItem[] = [
      { label: 'Dashboard', icon: 'dashboard', route: '/home', roles: ['admin', 'garcom', 'cozinha'] },
      { label: 'Novo Pedido', icon: 'add_shopping_cart', route: '/pedidos', roles: ['garcom', 'admin'] },
      { label: 'Pedidos Cozinha', icon: 'restaurant_menu', route: '/cozinha', roles: ['cozinha', 'admin'] },
      { label: 'Produtos', icon: 'inventory', route: '/produtos', roles: ['admin'] },
      { label: 'Gerenciar Mesas', icon: 'table_restaurant', route: '/mesas', roles: ['admin'] },
      { label: 'Gerenciar Contas', icon: 'receipt_long', route: '/contas', roles: ['admin', 'garcom'] },
    ];

    this.menuItems = allMenuItems.filter(item => {
      if (!item.roles) return true;
      return this.authService.hasRole(item.roles);
    });
  }

  logout(): void {
    this.authService.logout();
  }
}
