import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { DATE_FORMAT } from 'app/config/input.constants';
import { IEtudiant } from '../etudiant.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../etudiant.test-samples';

import { EtudiantService, RestEtudiant } from './etudiant.service';

const requireRestSample: RestEtudiant = {
  ...sampleWithRequiredData,
  enrollmentDate: sampleWithRequiredData.enrollmentDate?.format(DATE_FORMAT),
};

describe('Etudiant Service', () => {
  let service: EtudiantService;
  let httpMock: HttpTestingController;
  let expectedResult: IEtudiant | IEtudiant[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(EtudiantService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a Etudiant', () => {
      const etudiant = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(etudiant).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Etudiant', () => {
      const etudiant = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(etudiant).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Etudiant', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Etudiant', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Etudiant', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addEtudiantToCollectionIfMissing', () => {
      it('should add a Etudiant to an empty array', () => {
        const etudiant: IEtudiant = sampleWithRequiredData;
        expectedResult = service.addEtudiantToCollectionIfMissing([], etudiant);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(etudiant);
      });

      it('should not add a Etudiant to an array that contains it', () => {
        const etudiant: IEtudiant = sampleWithRequiredData;
        const etudiantCollection: IEtudiant[] = [
          {
            ...etudiant,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addEtudiantToCollectionIfMissing(etudiantCollection, etudiant);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Etudiant to an array that doesn't contain it", () => {
        const etudiant: IEtudiant = sampleWithRequiredData;
        const etudiantCollection: IEtudiant[] = [sampleWithPartialData];
        expectedResult = service.addEtudiantToCollectionIfMissing(etudiantCollection, etudiant);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(etudiant);
      });

      it('should add only unique Etudiant to an array', () => {
        const etudiantArray: IEtudiant[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const etudiantCollection: IEtudiant[] = [sampleWithRequiredData];
        expectedResult = service.addEtudiantToCollectionIfMissing(etudiantCollection, ...etudiantArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const etudiant: IEtudiant = sampleWithRequiredData;
        const etudiant2: IEtudiant = sampleWithPartialData;
        expectedResult = service.addEtudiantToCollectionIfMissing([], etudiant, etudiant2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(etudiant);
        expect(expectedResult).toContain(etudiant2);
      });

      it('should accept null and undefined values', () => {
        const etudiant: IEtudiant = sampleWithRequiredData;
        expectedResult = service.addEtudiantToCollectionIfMissing([], null, etudiant, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(etudiant);
      });

      it('should return initial array if no Etudiant is added', () => {
        const etudiantCollection: IEtudiant[] = [sampleWithRequiredData];
        expectedResult = service.addEtudiantToCollectionIfMissing(etudiantCollection, undefined, null);
        expect(expectedResult).toEqual(etudiantCollection);
      });
    });

    describe('compareEtudiant', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareEtudiant(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareEtudiant(entity1, entity2);
        const compareResult2 = service.compareEtudiant(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareEtudiant(entity1, entity2);
        const compareResult2 = service.compareEtudiant(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareEtudiant(entity1, entity2);
        const compareResult2 = service.compareEtudiant(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
