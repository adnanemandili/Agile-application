import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IClasse } from '../classe.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../classe.test-samples';

import { ClasseService } from './classe.service';

const requireRestSample: IClasse = {
  ...sampleWithRequiredData,
};

describe('Classe Service', () => {
  let service: ClasseService;
  let httpMock: HttpTestingController;
  let expectedResult: IClasse | IClasse[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ClasseService);
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

    it('should create a Classe', () => {
      const classe = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(classe).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Classe', () => {
      const classe = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(classe).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Classe', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Classe', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Classe', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addClasseToCollectionIfMissing', () => {
      it('should add a Classe to an empty array', () => {
        const classe: IClasse = sampleWithRequiredData;
        expectedResult = service.addClasseToCollectionIfMissing([], classe);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(classe);
      });

      it('should not add a Classe to an array that contains it', () => {
        const classe: IClasse = sampleWithRequiredData;
        const classeCollection: IClasse[] = [
          {
            ...classe,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addClasseToCollectionIfMissing(classeCollection, classe);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Classe to an array that doesn't contain it", () => {
        const classe: IClasse = sampleWithRequiredData;
        const classeCollection: IClasse[] = [sampleWithPartialData];
        expectedResult = service.addClasseToCollectionIfMissing(classeCollection, classe);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(classe);
      });

      it('should add only unique Classe to an array', () => {
        const classeArray: IClasse[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const classeCollection: IClasse[] = [sampleWithRequiredData];
        expectedResult = service.addClasseToCollectionIfMissing(classeCollection, ...classeArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const classe: IClasse = sampleWithRequiredData;
        const classe2: IClasse = sampleWithPartialData;
        expectedResult = service.addClasseToCollectionIfMissing([], classe, classe2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(classe);
        expect(expectedResult).toContain(classe2);
      });

      it('should accept null and undefined values', () => {
        const classe: IClasse = sampleWithRequiredData;
        expectedResult = service.addClasseToCollectionIfMissing([], null, classe, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(classe);
      });

      it('should return initial array if no Classe is added', () => {
        const classeCollection: IClasse[] = [sampleWithRequiredData];
        expectedResult = service.addClasseToCollectionIfMissing(classeCollection, undefined, null);
        expect(expectedResult).toEqual(classeCollection);
      });
    });

    describe('compareClasse', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareClasse(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareClasse(entity1, entity2);
        const compareResult2 = service.compareClasse(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareClasse(entity1, entity2);
        const compareResult2 = service.compareClasse(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareClasse(entity1, entity2);
        const compareResult2 = service.compareClasse(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
