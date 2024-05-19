import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IClasse } from '../classe.model';
import { ClasseService } from '../service/classe.service';

const classeResolve = (route: ActivatedRouteSnapshot): Observable<null | IClasse> => {
  const id = route.params['id'];
  if (id) {
    return inject(ClasseService)
      .find(id)
      .pipe(
        mergeMap((classe: HttpResponse<IClasse>) => {
          if (classe.body) {
            return of(classe.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default classeResolve;
