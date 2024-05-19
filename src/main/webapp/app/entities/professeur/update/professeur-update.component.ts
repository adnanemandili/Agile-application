import { Component, inject, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IClasse } from 'app/entities/classe/classe.model';
import { ClasseService } from 'app/entities/classe/service/classe.service';
import { IProfesseur } from '../professeur.model';
import { ProfesseurService } from '../service/professeur.service';
import { ProfesseurFormService, ProfesseurFormGroup } from './professeur-form.service';

@Component({
  standalone: true,
  selector: 'jhi-professeur-update',
  templateUrl: './professeur-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class ProfesseurUpdateComponent implements OnInit {
  isSaving = false;
  professeur: IProfesseur | null = null;

  classesSharedCollection: IClasse[] = [];

  protected professeurService = inject(ProfesseurService);
  protected professeurFormService = inject(ProfesseurFormService);
  protected classeService = inject(ClasseService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: ProfesseurFormGroup = this.professeurFormService.createProfesseurFormGroup();

  compareClasse = (o1: IClasse | null, o2: IClasse | null): boolean => this.classeService.compareClasse(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ professeur }) => {
      this.professeur = professeur;
      if (professeur) {
        this.updateForm(professeur);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const professeur = this.professeurFormService.getProfesseur(this.editForm);
    if (professeur.id !== null) {
      this.subscribeToSaveResponse(this.professeurService.update(professeur));
    } else {
      this.subscribeToSaveResponse(this.professeurService.create(professeur));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IProfesseur>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(professeur: IProfesseur): void {
    this.professeur = professeur;
    this.professeurFormService.resetForm(this.editForm, professeur);

    this.classesSharedCollection = this.classeService.addClasseToCollectionIfMissing<IClasse>(
      this.classesSharedCollection,
      ...(professeur.classes ?? []),
    );
  }

  protected loadRelationshipsOptions(): void {
    this.classeService
      .query()
      .pipe(map((res: HttpResponse<IClasse[]>) => res.body ?? []))
      .pipe(
        map((classes: IClasse[]) =>
          this.classeService.addClasseToCollectionIfMissing<IClasse>(classes, ...(this.professeur?.classes ?? [])),
        ),
      )
      .subscribe((classes: IClasse[]) => (this.classesSharedCollection = classes));
  }
}
