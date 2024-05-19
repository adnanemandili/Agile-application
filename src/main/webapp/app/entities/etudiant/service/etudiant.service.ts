import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map, Observable } from 'rxjs';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IEtudiant, NewEtudiant } from '../etudiant.model';

export type PartialUpdateEtudiant = Partial<IEtudiant> & Pick<IEtudiant, 'id'>;

type RestOf<T extends IEtudiant | NewEtudiant> = Omit<T, 'enrollmentDate'> & {
  enrollmentDate?: string | null;
};

export type RestEtudiant = RestOf<IEtudiant>;

export type NewRestEtudiant = RestOf<NewEtudiant>;

export type PartialUpdateRestEtudiant = RestOf<PartialUpdateEtudiant>;

export type EntityResponseType = HttpResponse<IEtudiant>;
export type EntityArrayResponseType = HttpResponse<IEtudiant[]>;

@Injectable({ providedIn: 'root' })
export class EtudiantService {
  protected http = inject(HttpClient);
  protected applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/etudiants');

  create(etudiant: NewEtudiant): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(etudiant);
    return this.http
      .post<RestEtudiant>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(etudiant: IEtudiant): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(etudiant);
    return this.http
      .put<RestEtudiant>(`${this.resourceUrl}/${this.getEtudiantIdentifier(etudiant)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(etudiant: PartialUpdateEtudiant): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(etudiant);
    return this.http
      .patch<RestEtudiant>(`${this.resourceUrl}/${this.getEtudiantIdentifier(etudiant)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestEtudiant>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestEtudiant[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getEtudiantIdentifier(etudiant: Pick<IEtudiant, 'id'>): number {
    return etudiant.id;
  }

  compareEtudiant(o1: Pick<IEtudiant, 'id'> | null, o2: Pick<IEtudiant, 'id'> | null): boolean {
    return o1 && o2 ? this.getEtudiantIdentifier(o1) === this.getEtudiantIdentifier(o2) : o1 === o2;
  }

  addEtudiantToCollectionIfMissing<Type extends Pick<IEtudiant, 'id'>>(
    etudiantCollection: Type[],
    ...etudiantsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const etudiants: Type[] = etudiantsToCheck.filter(isPresent);
    if (etudiants.length > 0) {
      const etudiantCollectionIdentifiers = etudiantCollection.map(etudiantItem => this.getEtudiantIdentifier(etudiantItem));
      const etudiantsToAdd = etudiants.filter(etudiantItem => {
        const etudiantIdentifier = this.getEtudiantIdentifier(etudiantItem);
        if (etudiantCollectionIdentifiers.includes(etudiantIdentifier)) {
          return false;
        }
        etudiantCollectionIdentifiers.push(etudiantIdentifier);
        return true;
      });
      return [...etudiantsToAdd, ...etudiantCollection];
    }
    return etudiantCollection;
  }

  protected convertDateFromClient<T extends IEtudiant | NewEtudiant | PartialUpdateEtudiant>(etudiant: T): RestOf<T> {
    return {
      ...etudiant,
      enrollmentDate: etudiant.enrollmentDate?.format(DATE_FORMAT) ?? null,
    };
  }

  protected convertDateFromServer(restEtudiant: RestEtudiant): IEtudiant {
    return {
      ...restEtudiant,
      enrollmentDate: restEtudiant.enrollmentDate ? dayjs(restEtudiant.enrollmentDate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestEtudiant>): HttpResponse<IEtudiant> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestEtudiant[]>): HttpResponse<IEtudiant[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
