import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IProfesseur, NewProfesseur } from '../professeur.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IProfesseur for edit and NewProfesseurFormGroupInput for create.
 */
type ProfesseurFormGroupInput = IProfesseur | PartialWithRequiredKeyOf<NewProfesseur>;

type ProfesseurFormDefaults = Pick<NewProfesseur, 'id' | 'classes'>;

type ProfesseurFormGroupContent = {
  id: FormControl<IProfesseur['id'] | NewProfesseur['id']>;
  firstName: FormControl<IProfesseur['firstName']>;
  lastName: FormControl<IProfesseur['lastName']>;
  email: FormControl<IProfesseur['email']>;
  phoneNumber: FormControl<IProfesseur['phoneNumber']>;
  hireDate: FormControl<IProfesseur['hireDate']>;
  classes: FormControl<IProfesseur['classes']>;
};

export type ProfesseurFormGroup = FormGroup<ProfesseurFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ProfesseurFormService {
  createProfesseurFormGroup(professeur: ProfesseurFormGroupInput = { id: null }): ProfesseurFormGroup {
    const professeurRawValue = {
      ...this.getFormDefaults(),
      ...professeur,
    };
    return new FormGroup<ProfesseurFormGroupContent>({
      id: new FormControl(
        { value: professeurRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      firstName: new FormControl(professeurRawValue.firstName, {
        validators: [Validators.required],
      }),
      lastName: new FormControl(professeurRawValue.lastName, {
        validators: [Validators.required],
      }),
      email: new FormControl(professeurRawValue.email, {
        validators: [Validators.required],
      }),
      phoneNumber: new FormControl(professeurRawValue.phoneNumber),
      hireDate: new FormControl(professeurRawValue.hireDate),
      classes: new FormControl(professeurRawValue.classes ?? []),
    });
  }

  getProfesseur(form: ProfesseurFormGroup): IProfesseur | NewProfesseur {
    return form.getRawValue() as IProfesseur | NewProfesseur;
  }

  resetForm(form: ProfesseurFormGroup, professeur: ProfesseurFormGroupInput): void {
    const professeurRawValue = { ...this.getFormDefaults(), ...professeur };
    form.reset(
      {
        ...professeurRawValue,
        id: { value: professeurRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): ProfesseurFormDefaults {
    return {
      id: null,
      classes: [],
    };
  }
}
