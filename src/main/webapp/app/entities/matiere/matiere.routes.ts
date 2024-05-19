import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { MatiereComponent } from './list/matiere.component';
import { MatiereDetailComponent } from './detail/matiere-detail.component';
import { MatiereUpdateComponent } from './update/matiere-update.component';
import MatiereResolve from './route/matiere-routing-resolve.service';

const matiereRoute: Routes = [
  {
    path: '',
    component: MatiereComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: MatiereDetailComponent,
    resolve: {
      matiere: MatiereResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: MatiereUpdateComponent,
    resolve: {
      matiere: MatiereResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: MatiereUpdateComponent,
    resolve: {
      matiere: MatiereResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default matiereRoute;
