import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { EtudiantComponent } from './list/etudiant.component';
import { EtudiantDetailComponent } from './detail/etudiant-detail.component';
import { EtudiantUpdateComponent } from './update/etudiant-update.component';
import EtudiantResolve from './route/etudiant-routing-resolve.service';

const etudiantRoute: Routes = [
  {
    path: '',
    component: EtudiantComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: EtudiantDetailComponent,
    resolve: {
      etudiant: EtudiantResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: EtudiantUpdateComponent,
    resolve: {
      etudiant: EtudiantResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: EtudiantUpdateComponent,
    resolve: {
      etudiant: EtudiantResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default etudiantRoute;
