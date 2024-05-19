import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';

import { IMatiere } from '../matiere.model';
import { MatiereService } from '../service/matiere.service';

import matiereResolve from './matiere-routing-resolve.service';

describe('Matiere routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let service: MatiereService;
  let resultMatiere: IMatiere | null | undefined;

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
    service = TestBed.inject(MatiereService);
    resultMatiere = undefined;
  });

  describe('resolve', () => {
    it('should return IMatiere returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      TestBed.runInInjectionContext(() => {
        matiereResolve(mockActivatedRouteSnapshot).subscribe({
          next(result) {
            resultMatiere = result;
          },
        });
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultMatiere).toEqual({ id: 123 });
    });

    it('should return null if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      TestBed.runInInjectionContext(() => {
        matiereResolve(mockActivatedRouteSnapshot).subscribe({
          next(result) {
            resultMatiere = result;
          },
        });
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultMatiere).toEqual(null);
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse<IMatiere>({ body: null })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      TestBed.runInInjectionContext(() => {
        matiereResolve(mockActivatedRouteSnapshot).subscribe({
          next(result) {
            resultMatiere = result;
          },
        });
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultMatiere).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
