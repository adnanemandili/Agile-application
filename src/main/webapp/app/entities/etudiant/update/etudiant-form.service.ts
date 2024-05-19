import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IEtudiant, NewEtudiant } from '../etudiant.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IEtudiant for edit and NewEtudiantFormGroupInput for create.
 */
type EtudiantFormGroupInput = IEtudiant | PartialWithRequiredKeyOf<NewEtudiant>;

type EtudiantFormDefaults = Pick<NewEtudiant, 'id'>;

type EtudiantFormGroupContent = {
  id: FormControl<IEtudiant['id'] | NewEtudiant['id']>;
  firstName: FormControl<IEtudiant['firstName']>;
  lastName: FormControl<IEtudiant['lastName']>;
  email: FormControl<IEtudiant['email']>;
  apogee: FormControl<IEtudiant['apogee']>;
  niveau: FormControl<IEtudiant['niveau']>;
  filere: FormControl<IEtudiant['filere']>;
  enrollmentDate: FormControl<IEtudiant['enrollmentDate']>;
  classe: FormControl<IEtudiant['classe']>;
};

export type EtudiantFormGroup = FormGroup<EtudiantFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class EtudiantFormService {
  createEtudiantFormGroup(etudiant: EtudiantFormGroupInput = { id: null }): EtudiantFormGroup {
    const etudiantRawValue = {
      ...this.getFormDefaults(),
      ...etudiant,
    };
    return new FormGroup<EtudiantFormGroupContent>({
      id: new FormControl(
        { value: etudiantRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      firstName: new FormControl(etudiantRawValue.firstName, {
        validators: [Validators.required],
      }),
      lastName: new FormControl(etudiantRawValue.lastName, {
        validators: [Validators.required],
      }),
      email: new FormControl(etudiantRawValue.email, {
        validators: [Validators.required],
      }),
      apogee: new FormControl(etudiantRawValue.apogee, {
        validators: [Validators.required],
      }),
      niveau: new FormControl(etudiantRawValue.niveau),
      filere: new FormControl(etudiantRawValue.filere),
      enrollmentDate: new FormControl(etudiantRawValue.enrollmentDate),
      classe: new FormControl(etudiantRawValue.classe),
    });
  }

  getEtudiant(form: EtudiantFormGroup): IEtudiant | NewEtudiant {
    return form.getRawValue() as IEtudiant | NewEtudiant;
  }

  resetForm(form: EtudiantFormGroup, etudiant: EtudiantFormGroupInput): void {
    const etudiantRawValue = { ...this.getFormDefaults(), ...etudiant };
    form.reset(
      {
        ...etudiantRawValue,
        id: { value: etudiantRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): EtudiantFormDefaults {
    return {
      id: null,
    };
  }
}
