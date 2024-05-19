import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IMatiere } from '../matiere.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../matiere.test-samples';

import { MatiereService } from './matiere.service';

const requireRestSample: IMatiere = {
  ...sampleWithRequiredData,
};

describe('Matiere Service', () => {
  let service: MatiereService;
  let httpMock: HttpTestingController;
  let expectedResult: IMatiere | IMatiere[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(MatiereService);
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

    it('should create a Matiere', () => {
      const matiere = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(matiere).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Matiere', () => {
      const matiere = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(matiere).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Matiere', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Matiere', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Matiere', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addMatiereToCollectionIfMissing', () => {
      it('should add a Matiere to an empty array', () => {
        const matiere: IMatiere = sampleWithRequiredData;
        expectedResult = service.addMatiereToCollectionIfMissing([], matiere);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(matiere);
      });

      it('should not add a Matiere to an array that contains it', () => {
        const matiere: IMatiere = sampleWithRequiredData;
        const matiereCollection: IMatiere[] = [
          {
            ...matiere,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addMatiereToCollectionIfMissing(matiereCollection, matiere);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Matiere to an array that doesn't contain it", () => {
        const matiere: IMatiere = sampleWithRequiredData;
        const matiereCollection: IMatiere[] = [sampleWithPartialData];
        expectedResult = service.addMatiereToCollectionIfMissing(matiereCollection, matiere);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(matiere);
      });

      it('should add only unique Matiere to an array', () => {
        const matiereArray: IMatiere[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const matiereCollection: IMatiere[] = [sampleWithRequiredData];
        expectedResult = service.addMatiereToCollectionIfMissing(matiereCollection, ...matiereArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const matiere: IMatiere = sampleWithRequiredData;
        const matiere2: IMatiere = sampleWithPartialData;
        expectedResult = service.addMatiereToCollectionIfMissing([], matiere, matiere2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(matiere);
        expect(expectedResult).toContain(matiere2);
      });

      it('should accept null and undefined values', () => {
        const matiere: IMatiere = sampleWithRequiredData;
        expectedResult = service.addMatiereToCollectionIfMissing([], null, matiere, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(matiere);
      });

      it('should return initial array if no Matiere is added', () => {
        const matiereCollection: IMatiere[] = [sampleWithRequiredData];
        expectedResult = service.addMatiereToCollectionIfMissing(matiereCollection, undefined, null);
        expect(expectedResult).toEqual(matiereCollection);
      });
    });

    describe('compareMatiere', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareMatiere(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareMatiere(entity1, entity2);
        const compareResult2 = service.compareMatiere(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareMatiere(entity1, entity2);
        const compareResult2 = service.compareMatiere(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareMatiere(entity1, entity2);
        const compareResult2 = service.compareMatiere(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
