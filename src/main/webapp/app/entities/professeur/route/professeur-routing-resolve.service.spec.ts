import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';

import { IProfesseur } from '../professeur.model';
import { ProfesseurService } from '../service/professeur.service';

import professeurResolve from './professeur-routing-resolve.service';

describe('Professeur routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let service: ProfesseurService;
  let resultProfesseur: IProfesseur | null | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({}),
            },
          },
        },
      ],
    });
    mockRouter = TestBed.inject(Router);
    jest.spyOn(mockRouter, 'navigate').mockImplementation(() => Promise.resolve(true));
    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRoute).snapshot;
    service = TestBed.inject(ProfesseurService);
    resultProfesseur = undefined;
  });

  describe('resolve', () => {
    it('should return IProfesseur returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      TestBed.runInInjectionContext(() => {
        professeurResolve(mockActivatedRouteSnapshot).subscribe({
          next(result) {
            resultProfesseur = result;
          },
        });
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultProfesseur).toEqual({ id: 123 });
    });

    it('should return null if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      TestBed.runInInjectionContext(() => {
        professeurResolve(mockActivatedRouteSnapshot).subscribe({
          next(result) {
            resultProfesseur = result;
          },
        });
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultProfesseur).toEqual(null);
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse<IProfesseur>({ body: null })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      TestBed.runInInjectionContext(() => {
        professeurResolve(mockActivatedRouteSnapshot).subscribe({
          next(result) {
            resultProfesseur = result;
          },
        });
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultProfesseur).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
