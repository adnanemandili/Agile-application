import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IMatiere, NewMatiere } from '../matiere.model';

export type PartialUpdateMatiere = Partial<IMatiere> & Pick<IMatiere, 'id'>;

export type EntityResponseType = HttpResponse<IMatiere>;
export type EntityArrayResponseType = HttpResponse<IMatiere[]>;

@Injectable({ providedIn: 'root' })
export class MatiereService {
  protected http = inject(HttpClient);
  protected applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/matieres');

  create(matiere: NewMatiere): Observable<EntityResponseType> {
    return this.http.post<IMatiere>(this.resourceUrl, matiere, { observe: 'response' });
  }

  update(matiere: IMatiere): Observable<EntityResponseType> {
    return this.http.put<IMatiere>(`${this.resourceUrl}/${this.getMatiereIdentifier(matiere)}`, matiere, { observe: 'response' });
  }

  partialUpdate(matiere: PartialUpdateMatiere): Observable<EntityResponseType> {
    return this.http.patch<IMatiere>(`${this.resourceUrl}/${this.getMatiereIdentifier(matiere)}`, matiere, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IMatiere>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IMatiere[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getMatiereIdentifier(matiere: Pick<IMatiere, 'id'>): number {
    return matiere.id;
  }

  compareMatiere(o1: Pick<IMatiere, 'id'> | null, o2: Pick<IMatiere, 'id'> | null): boolean {
    return o1 && o2 ? this.getMatiereIdentifier(o1) === this.getMatiereIdentifier(o2) : o1 === o2;
  }

  addMatiereToCollectionIfMissing<Type extends Pick<IMatiere, 'id'>>(
    matiereCollection: Type[],
    ...matieresToCheck: (Type | null | undefined)[]
  ): Type[] {
    const matieres: Type[] = matieresToCheck.filter(isPresent);
    if (matieres.length > 0) {
      const matiereCollectionIdentifiers = matiereCollection.map(matiereItem => this.getMatiereIdentifier(matiereItem));
      const matieresToAdd = matieres.filter(matiereItem => {
        const matiereIdentifier = this.getMatiereIdentifier(matiereItem);
        if (matiereCollectionIdentifiers.includes(matiereIdentifier)) {
          return false;
        }
        matiereCollectionIdentifiers.push(matiereIdentifier);
        return true;
      });
      return [...matieresToAdd, ...matiereCollection];
    }
    return matiereCollection;
  }
}
