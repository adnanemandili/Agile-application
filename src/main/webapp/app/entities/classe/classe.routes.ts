import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { ClasseComponent } from './list/classe.component';
import { ClasseDetailComponent } from './detail/classe-detail.component';
import { ClasseUpdateComponent } from './update/classe-update.component';
import ClasseResolve from './route/classe-routing-resolve.service';

const classeRoute: Routes = [
  {
    path: '',
    component: ClasseComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ClasseDetailComponent,
    resolve: {
      classe: ClasseResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ClasseUpdateComponent,
    resolve: {
      classe: ClasseResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ClasseUpdateComponent,
    resolve: {
      classe: ClasseResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default classeRoute;
