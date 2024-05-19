import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IEtudiant } from '../etudiant.model';
import { EtudiantService } from '../service/etudiant.service';

const etudiantResolve = (route: ActivatedRouteSnapshot): Observable<null | IEtudiant> => {
  const id = route.params['id'];
  if (id) {
    return inject(EtudiantService)
      .find(id)
      .pipe(
        mergeMap((etudiant: HttpResponse<IEtudiant>) => {
          if (etudiant.body) {
            return of(etudiant.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default etudiantResolve;
