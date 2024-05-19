import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { DATE_FORMAT } from 'app/config/input.constants';
import { IProfesseur } from '../professeur.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../professeur.test-samples';

import { ProfesseurService, RestProfesseur } from './professeur.service';

const requireRestSample: RestProfesseur = {
  ...sampleWithRequiredData,
  hireDate: sampleWithRequiredData.hireDate?.format(DATE_FORMAT),
};

describe('Professeur Service', () => {
  let service: ProfesseurService;
  let httpMock: HttpTestingController;
  let expectedResult: IProfesseur | IProfesseur[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ProfesseurService);
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

    it('should create a Professeur', () => {
      const professeur = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(professeur).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Professeur', () => {
      const professeur = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(professeur).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Professeur', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Professeur', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Professeur', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addProfesseurToCollectionIfMissing', () => {
      it('should add a Professeur to an empty array', () => {
        const professeur: IProfesseur = sampleWithRequiredData;
        expectedResult = service.addProfesseurToCollectionIfMissing([], professeur);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(professeur);
      });

      it('should not add a Professeur to an array that contains it', () => {
        const professeur: IProfesseur = sampleWithRequiredData;
        const professeurCollection: IProfesseur[] = [
          {
            ...professeur,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addProfesseurToCollectionIfMissing(professeurCollection, professeur);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Professeur to an array that doesn't contain it", () => {
        const professeur: IProfesseur = sampleWithRequiredData;
        const professeurCollection: IProfesseur[] = [sampleWithPartialData];
        expectedResult = service.addProfesseurToCollectionIfMissing(professeurCollection, professeur);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(professeur);
      });

      it('should add only unique Professeur to an array', () => {
        const professeurArray: IProfesseur[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const professeurCollection: IProfesseur[] = [sampleWithRequiredData];
        expectedResult = service.addProfesseurToCollectionIfMissing(professeurCollection, ...professeurArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const professeur: IProfesseur = sampleWithRequiredData;
        const professeur2: IProfesseur = sampleWithPartialData;
        expectedResult = service.addProfesseurToCollectionIfMissing([], professeur, professeur2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(professeur);
        expect(expectedResult).toContain(professeur2);
      });

      it('should accept null and undefined values', () => {
        const professeur: IProfesseur = sampleWithRequiredData;
        expectedResult = service.addProfesseurToCollectionIfMissing([], null, professeur, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(professeur);
      });

      it('should return initial array if no Professeur is added', () => {
        const professeurCollection: IProfesseur[] = [sampleWithRequiredData];
        expectedResult = service.addProfesseurToCollectionIfMissing(professeurCollection, undefined, null);
        expect(expectedResult).toEqual(professeurCollection);
      });
    });

    describe('compareProfesseur', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareProfesseur(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareProfesseur(entity1, entity2);
        const compareResult2 = service.compareProfesseur(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareProfesseur(entity1, entity2);
        const compareResult2 = service.compareProfesseur(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareProfesseur(entity1, entity2);
        const compareResult2 = service.compareProfesseur(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
