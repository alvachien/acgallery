import { Routes } from '@angular/router';

import { UserDetailComponent } from './user-detail/user-detail.component';

export const USER_DETAIL_ROUTERS: Routes = [
  { path: 'display', component: UserDetailComponent },
  { path: 'edit/:id', component: UserDetailComponent },
];
