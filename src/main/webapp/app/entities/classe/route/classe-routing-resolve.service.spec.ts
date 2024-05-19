import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';

import { IClasse } from '../classe.model';
import { ClasseService } from '../service/classe.service';

import classeResolve from './classe-routing-resolve.service';

describe('Classe routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let service: ClasseService;
  let resultClasse: IClasse | null | undefined;

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
    service = TestBed.inject(ClasseService);
    resultClasse = undefined;
  });

  describe('resolve', () => {
    it('should return IClasse returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      TestBed.runInInjectionContext(() => {
        classeResolve(mockActivatedRouteSnapshot).subscribe({
          next(result) {
            resultClasse = result;
          },
        });
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultClasse).toEqual({ id: 123 });
    });

    it('should return null if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      TestBed.runInInjectionContext(() => {
        classeResolve(mockActivatedRouteSnapshot).subscribe({
          next(result) {
            resultClasse = result;
          },
        });
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultClasse).toEqual(null);
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse<IClasse>({ body: null })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      TestBed.runInInjectionContext(() => {
        classeResolve(mockActivatedRouteSnapshot).subscribe({
          next(result) {
            resultClasse = result;
          },
        });
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultClasse).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
