import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IMatiere } from '../matiere.model';
import { MatiereService } from '../service/matiere.service';

const matiereResolve = (route: ActivatedRouteSnapshot): Observable<null | IMatiere> => {
  const id = route.params['id'];
  if (id) {
    return inject(MatiereService)
      .find(id)
      .pipe(
        mergeMap((matiere: HttpResponse<IMatiere>) => {
          if (matiere.body) {
            return of(matiere.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default matiereResolve;
