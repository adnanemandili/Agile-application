import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../etudiant.test-samples';

import { EtudiantFormService } from './etudiant-form.service';

describe('Etudiant Form Service', () => {
  let service: EtudiantFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EtudiantFormService);
  });

  describe('Service methods', () => {
    describe('createEtudiantFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createEtudiantFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            firstName: expect.any(Object),
            lastName: expect.any(Object),
            email: expect.any(Object),
            apogee: expect.any(Object),
            niveau: expect.any(Object),
            filere: expect.any(Object),
            enrollmentDate: expect.any(Object),
            classe: expect.any(Object),
          }),
        );
      });

      it('passing IEtudiant should create a new form with FormGroup', () => {
        const formGroup = service.createEtudiantFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            firstName: expect.any(Object),
            lastName: expect.any(Object),
            email: expect.any(Object),
            apogee: expect.any(Object),
            niveau: expect.any(Object),
            filere: expect.any(Object),
            enrollmentDate: expect.any(Object),
            classe: expect.any(Object),
          }),
        );
      });
    });

    describe('getEtudiant', () => {
      it('should return NewEtudiant for default Etudiant initial value', () => {
        const formGroup = service.createEtudiantFormGroup(sampleWithNewData);

        const etudiant = service.getEtudiant(formGroup) as any;

        expect(etudiant).toMatchObject(sampleWithNewData);
      });

      it('should return NewEtudiant for empty Etudiant initial value', () => {
        const formGroup = service.createEtudiantFormGroup();

        const etudiant = service.getEtudiant(formGroup) as any;

        expect(etudiant).toMatchObject({});
      });

      it('should return IEtudiant', () => {
        const formGroup = service.createEtudiantFormGroup(sampleWithRequiredData);

        const etudiant = service.getEtudiant(formGroup) as any;

        expect(etudiant).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IEtudiant should not enable id FormControl', () => {
        const formGroup = service.createEtudiantFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewEtudiant should disable id FormControl', () => {
        const formGroup = service.createEtudiantFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
