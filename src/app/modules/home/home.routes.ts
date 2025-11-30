// src/modules/home/home.routes.ts
import { Routes } from '@angular/router';
import { HomeComponent } from './home/home';

export const HOME_ROUTES: Routes = [
  {
    // este '' é relativo ao /home definido no app.routes.ts
    path: '',
    component: HomeComponent,
  }
];
