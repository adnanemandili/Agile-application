import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IClasse, NewClasse } from '../classe.model';

export type PartialUpdateClasse = Partial<IClasse> & Pick<IClasse, 'id'>;

export type EntityResponseType = HttpResponse<IClasse>;
export type EntityArrayResponseType = HttpResponse<IClasse[]>;

@Injectable({ providedIn: 'root' })
export class ClasseService {
  protected http = inject(HttpClient);
  protected applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/classes');

  create(classe: NewClasse): Observable<EntityResponseType> {
    return this.http.post<IClasse>(this.resourceUrl, classe, { observe: 'response' });
  }

  update(classe: IClasse): Observable<EntityResponseType> {
    return this.http.put<IClasse>(`${this.resourceUrl}/${this.getClasseIdentifier(classe)}`, classe, { observe: 'response' });
  }

  partialUpdate(classe: PartialUpdateClasse): Observable<EntityResponseType> {
    return this.http.patch<IClasse>(`${this.resourceUrl}/${this.getClasseIdentifier(classe)}`, classe, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IClasse>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IClasse[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getClasseIdentifier(classe: Pick<IClasse, 'id'>): number {
    return classe.id;
  }

  compareClasse(o1: Pick<IClasse, 'id'> | null, o2: Pick<IClasse, 'id'> | null): boolean {
    return o1 && o2 ? this.getClasseIdentifier(o1) === this.getClasseIdentifier(o2) : o1 === o2;
  }

  addClasseToCollectionIfMissing<Type extends Pick<IClasse, 'id'>>(
    classeCollection: Type[],
    ...classesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const classes: Type[] = classesToCheck.filter(isPresent);
    if (classes.length > 0) {
      const classeCollectionIdentifiers = classeCollection.map(classeItem => this.getClasseIdentifier(classeItem));
      const classesToAdd = classes.filter(classeItem => {
        const classeIdentifier = this.getClasseIdentifier(classeItem);
        if (classeCollectionIdentifiers.includes(classeIdentifier)) {
          return false;
        }
        classeCollectionIdentifiers.push(classeIdentifier);
        return true;
      });
      return [...classesToAdd, ...classeCollection];
    }
    return classeCollection;
  }
}
