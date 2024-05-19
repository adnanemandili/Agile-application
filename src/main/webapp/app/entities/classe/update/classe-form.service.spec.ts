import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../classe.test-samples';

import { ClasseFormService } from './classe-form.service';

describe('Classe Form Service', () => {
  let service: ClasseFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClasseFormService);
  });

  describe('Service methods', () => {
    describe('createClasseFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createClasseFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            className: expect.any(Object),
            level: expect.any(Object),
            group: expect.any(Object),
            niveau: expect.any(Object),
            filere: expect.any(Object),
            professeurs: expect.any(Object),
          }),
        );
      });

      it('passing IClasse should create a new form with FormGroup', () => {
        const formGroup = service.createClasseFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            className: expect.any(Object),
            level: expect.any(Object),
            group: expect.any(Object),
            niveau: expect.any(Object),
            filere: expect.any(Object),
            professeurs: expect.any(Object),
          }),
        );
      });
    });

    describe('getClasse', () => {
      it('should return NewClasse for default Classe initial value', () => {
        const formGroup = service.createClasseFormGroup(sampleWithNewData);

        const classe = service.getClasse(formGroup) as any;

        expect(classe).toMatchObject(sampleWithNewData);
      });

      it('should return NewClasse for empty Classe initial value', () => {
        const formGroup = service.createClasseFormGroup();

        const classe = service.getClasse(formGroup) as any;

        expect(classe).toMatchObject({});
      });

      it('should return IClasse', () => {
        const formGroup = service.createClasseFormGroup(sampleWithRequiredData);

        const classe = service.getClasse(formGroup) as any;

        expect(classe).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IClasse should not enable id FormControl', () => {
        const formGroup = service.createClasseFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewClasse should disable id FormControl', () => {
        const formGroup = service.createClasseFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
