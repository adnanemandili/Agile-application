import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map, Observable } from 'rxjs';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IProfesseur, NewProfesseur } from '../professeur.model';

export type PartialUpdateProfesseur = Partial<IProfesseur> & Pick<IProfesseur, 'id'>;

type RestOf<T extends IProfesseur | NewProfesseur> = Omit<T, 'hireDate'> & {
  hireDate?: string | null;
};

export type RestProfesseur = RestOf<IProfesseur>;

export type NewRestProfesseur = RestOf<NewProfesseur>;

export type PartialUpdateRestProfesseur = RestOf<PartialUpdateProfesseur>;

export type EntityResponseType = HttpResponse<IProfesseur>;
export type EntityArrayResponseType = HttpResponse<IProfesseur[]>;

@Injectable({ providedIn: 'root' })
export class ProfesseurService {
  protected http = inject(HttpClient);
  protected applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/professeurs');

  create(professeur: NewProfesseur): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(professeur);
    return this.http
      .post<RestProfesseur>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(professeur: IProfesseur): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(professeur);
    return this.http
      .put<RestProfesseur>(`${this.resourceUrl}/${this.getProfesseurIdentifier(professeur)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(professeur: PartialUpdateProfesseur): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(professeur);
    return this.http
      .patch<RestProfesseur>(`${this.resourceUrl}/${this.getProfesseurIdentifier(professeur)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestProfesseur>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestProfesseur[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getProfesseurIdentifier(professeur: Pick<IProfesseur, 'id'>): number {
    return professeur.id;
  }

  compareProfesseur(o1: Pick<IProfesseur, 'id'> | null, o2: Pick<IProfesseur, 'id'> | null): boolean {
    return o1 && o2 ? this.getProfesseurIdentifier(o1) === this.getProfesseurIdentifier(o2) : o1 === o2;
  }

  addProfesseurToCollectionIfMissing<Type extends Pick<IProfesseur, 'id'>>(
    professeurCollection: Type[],
    ...professeursToCheck: (Type | null | undefined)[]
  ): Type[] {
    const professeurs: Type[] = professeursToCheck.filter(isPresent);
    if (professeurs.length > 0) {
      const professeurCollectionIdentifiers = professeurCollection.map(professeurItem => this.getProfesseurIdentifier(professeurItem));
      const professeursToAdd = professeurs.filter(professeurItem => {
        const professeurIdentifier = this.getProfesseurIdentifier(professeurItem);
        if (professeurCollectionIdentifiers.includes(professeurIdentifier)) {
          return false;
        }
        professeurCollectionIdentifiers.push(professeurIdentifier);
        return true;
      });
      return [...professeursToAdd, ...professeurCollection];
    }
    return professeurCollection;
  }

  protected convertDateFromClient<T extends IProfesseur | NewProfesseur | PartialUpdateProfesseur>(professeur: T): RestOf<T> {
    return {
      ...professeur,
      hireDate: professeur.hireDate?.format(DATE_FORMAT) ?? null,
    };
  }

  protected convertDateFromServer(restProfesseur: RestProfesseur): IProfesseur {
    return {
      ...restProfesseur,
      hireDate: restProfesseur.hireDate ? dayjs(restProfesseur.hireDate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestProfesseur>): HttpResponse<IProfesseur> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestProfesseur[]>): HttpResponse<IProfesseur[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
