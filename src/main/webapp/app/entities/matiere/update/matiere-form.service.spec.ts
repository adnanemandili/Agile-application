import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../matiere.test-samples';

import { MatiereFormService } from './matiere-form.service';

describe('Matiere Form Service', () => {
  let service: MatiereFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MatiereFormService);
  });

  describe('Service methods', () => {
    describe('createMatiereFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createMatiereFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            subjectName: expect.any(Object),
            description: expect.any(Object),
            professeur: expect.any(Object),
          }),
        );
      });

      it('passing IMatiere should create a new form with FormGroup', () => {
        const formGroup = service.createMatiereFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            subjectName: expect.any(Object),
            description: expect.any(Object),
            professeur: expect.any(Object),
          }),
        );
      });
    });

    describe('getMatiere', () => {
      it('should return NewMatiere for default Matiere initial value', () => {
        const formGroup = service.createMatiereFormGroup(sampleWithNewData);

        const matiere = service.getMatiere(formGroup) as any;

        expect(matiere).toMatchObject(sampleWithNewData);
      });

      it('should return NewMatiere for empty Matiere initial value', () => {
        const formGroup = service.createMatiereFormGroup();

        const matiere = service.getMatiere(formGroup) as any;

        expect(matiere).toMatchObject({});
      });

      it('should return IMatiere', () => {
        const formGroup = service.createMatiereFormGroup(sampleWithRequiredData);

        const matiere = service.getMatiere(formGroup) as any;

        expect(matiere).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IMatiere should not enable id FormControl', () => {
        const formGroup = service.createMatiereFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewMatiere should disable id FormControl', () => {
        const formGroup = service.createMatiereFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
