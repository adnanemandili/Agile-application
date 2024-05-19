import { Component, inject, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IProfesseur } from 'app/entities/professeur/professeur.model';
import { ProfesseurService } from 'app/entities/professeur/service/professeur.service';
import { IMatiere } from '../matiere.model';
import { MatiereService } from '../service/matiere.service';
import { MatiereFormService, MatiereFormGroup } from './matiere-form.service';

@Component({
  standalone: true,
  selector: 'jhi-matiere-update',
  templateUrl: './matiere-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class MatiereUpdateComponent implements OnInit {
  isSaving = false;
  matiere: IMatiere | null = null;

  professeursSharedCollection: IProfesseur[] = [];

  protected matiereService = inject(MatiereService);
  protected matiereFormService = inject(MatiereFormService);
  protected professeurService = inject(ProfesseurService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: MatiereFormGroup = this.matiereFormService.createMatiereFormGroup();

  compareProfesseur = (o1: IProfesseur | null, o2: IProfesseur | null): boolean => this.professeurService.compareProfesseur(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ matiere }) => {
      this.matiere = matiere;
      if (matiere) {
        this.updateForm(matiere);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const matiere = this.matiereFormService.getMatiere(this.editForm);
    if (matiere.id !== null) {
      this.subscribeToSaveResponse(this.matiereService.update(matiere));
    } else {
      this.subscribeToSaveResponse(this.matiereService.create(matiere));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IMatiere>>): void {
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

  protected updateForm(matiere: IMatiere): void {
    this.matiere = matiere;
    this.matiereFormService.resetForm(this.editForm, matiere);

    this.professeursSharedCollection = this.professeurService.addProfesseurToCollectionIfMissing<IProfesseur>(
      this.professeursSharedCollection,
      matiere.professeur,
    );
  }

  protected loadRelationshipsOptions(): void {
    this.professeurService
      .query()
      .pipe(map((res: HttpResponse<IProfesseur[]>) => res.body ?? []))
      .pipe(
        map((professeurs: IProfesseur[]) =>
          this.professeurService.addProfesseurToCollectionIfMissing<IProfesseur>(professeurs, this.matiere?.professeur),
        ),
      )
      .subscribe((professeurs: IProfesseur[]) => (this.professeursSharedCollection = professeurs));
  }
}
