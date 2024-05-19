import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { ProfesseurComponent } from './list/professeur.component';
import { ProfesseurDetailComponent } from './detail/professeur-detail.component';
import { ProfesseurUpdateComponent } from './update/professeur-update.component';
import ProfesseurResolve from './route/professeur-routing-resolve.service';

const professeurRoute: Routes = [
  {
    path: '',
    component: ProfesseurComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ProfesseurDetailComponent,
    resolve: {
      professeur: ProfesseurResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ProfesseurUpdateComponent,
    resolve: {
      professeur: ProfesseurResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ProfesseurUpdateComponent,
    resolve: {
      professeur: ProfesseurResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default professeurRoute;
