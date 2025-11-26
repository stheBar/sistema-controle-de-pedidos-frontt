import { Routes } from '@angular/router';

import { homeGuard } from '../../app/core/security/auth.guard';
import {HomeComponent} from './home/home';

export const HOME_ROUTES: Routes = [
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [homeGuard]
  }
];
