import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IProfesseur } from '../professeur.model';
import { ProfesseurService } from '../service/professeur.service';

const professeurResolve = (route: ActivatedRouteSnapshot): Observable<null | IProfesseur> => {
  const id = route.params['id'];
  if (id) {
    return inject(ProfesseurService)
      .find(id)
      .pipe(
        mergeMap((professeur: HttpResponse<IProfesseur>) => {
          if (professeur.body) {
            return of(professeur.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default professeurResolve;
