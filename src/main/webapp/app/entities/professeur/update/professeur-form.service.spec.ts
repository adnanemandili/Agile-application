import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../professeur.test-samples';

import { ProfesseurFormService } from './professeur-form.service';

describe('Professeur Form Service', () => {
  let service: ProfesseurFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProfesseurFormService);
  });

  describe('Service methods', () => {
    describe('createProfesseurFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createProfesseurFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            firstName: expect.any(Object),
            lastName: expect.any(Object),
            email: expect.any(Object),
            phoneNumber: expect.any(Object),
            hireDate: expect.any(Object),
            classes: expect.any(Object),
          }),
        );
      });

      it('passing IProfesseur should create a new form with FormGroup', () => {
        const formGroup = service.createProfesseurFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            firstName: expect.any(Object),
            lastName: expect.any(Object),
            email: expect.any(Object),
            phoneNumber: expect.any(Object),
            hireDate: expect.any(Object),
            classes: expect.any(Object),
          }),
        );
      });
    });

    describe('getProfesseur', () => {
      it('should return NewProfesseur for default Professeur initial value', () => {
        const formGroup = service.createProfesseurFormGroup(sampleWithNewData);

        const professeur = service.getProfesseur(formGroup) as any;

        expect(professeur).toMatchObject(sampleWithNewData);
      });

      it('should return NewProfesseur for empty Professeur initial value', () => {
        const formGroup = service.createProfesseurFormGroup();

        const professeur = service.getProfesseur(formGroup) as any;

        expect(professeur).toMatchObject({});
      });

      it('should return IProfesseur', () => {
        const formGroup = service.createProfesseurFormGroup(sampleWithRequiredData);

        const professeur = service.getProfesseur(formGroup) as any;

        expect(professeur).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IProfesseur should not enable id FormControl', () => {
        const formGroup = service.createProfesseurFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewProfesseur should disable id FormControl', () => {
        const formGroup = service.createProfesseurFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
