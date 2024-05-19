import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';

import { IEtudiant } from '../etudiant.model';
import { EtudiantService } from '../service/etudiant.service';

import etudiantResolve from './etudiant-routing-resolve.service';

describe('Etudiant routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let service: EtudiantService;
  let resultEtudiant: IEtudiant | null | undefined;

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
    service = TestBed.inject(EtudiantService);
    resultEtudiant = undefined;
  });

  describe('resolve', () => {
    it('should return IEtudiant returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      TestBed.runInInjectionContext(() => {
        etudiantResolve(mockActivatedRouteSnapshot).subscribe({
          next(result) {
            resultEtudiant = result;
          },
        });
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultEtudiant).toEqual({ id: 123 });
    });

    it('should return null if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      TestBed.runInInjectionContext(() => {
        etudiantResolve(mockActivatedRouteSnapshot).subscribe({
          next(result) {
            resultEtudiant = result;
          },
        });
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultEtudiant).toEqual(null);
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse<IEtudiant>({ body: null })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      TestBed.runInInjectionContext(() => {
        etudiantResolve(mockActivatedRouteSnapshot).subscribe({
          next(result) {
            resultEtudiant = result;
          },
        });
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultEtudiant).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
