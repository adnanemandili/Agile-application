import { Component, inject, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IProfesseur } from 'app/entities/professeur/professeur.model';
import { ProfesseurService } from 'app/entities/professeur/service/professeur.service';
import { Groupe } from 'app/entities/enumerations/groupe.model';
import { Niveau } from 'app/entities/enumerations/niveau.model';
import { Filiere } from 'app/entities/enumerations/filiere.model';
import { ClasseService } from '../service/classe.service';
import { IClasse } from '../classe.model';
import { ClasseFormService, ClasseFormGroup } from './classe-form.service';

@Component({
  standalone: true,
  selector: 'jhi-classe-update',
  templateUrl: './classe-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class ClasseUpdateComponent implements OnInit {
  isSaving = false;
  classe: IClasse | null = null;
  groupeValues = Object.keys(Groupe);
  niveauValues = Object.keys(Niveau);
  filiereValues = Object.keys(Filiere);

  professeursSharedCollection: IProfesseur[] = [];

  protected classeService = inject(ClasseService);
  protected classeFormService = inject(ClasseFormService);
  protected professeurService = inject(ProfesseurService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: ClasseFormGroup = this.classeFormService.createClasseFormGroup();

  compareProfesseur = (o1: IProfesseur | null, o2: IProfesseur | null): boolean => this.professeurService.compareProfesseur(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ classe }) => {
      this.classe = classe;
      if (classe) {
        this.updateForm(classe);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const classe = this.classeFormService.getClasse(this.editForm);
    if (classe.id !== null) {
      this.subscribeToSaveResponse(this.classeService.update(classe));
    } else {
      this.subscribeToSaveResponse(this.classeService.create(classe));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IClasse>>): void {
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

  protected updateForm(classe: IClasse): void {
    this.classe = classe;
    this.classeFormService.resetForm(this.editForm, classe);

    this.professeursSharedCollection = this.professeurService.addProfesseurToCollectionIfMissing<IProfesseur>(
      this.professeursSharedCollection,
      ...(classe.professeurs ?? []),
    );
  }

  protected loadRelationshipsOptions(): void {
    this.professeurService
      .query()
      .pipe(map((res: HttpResponse<IProfesseur[]>) => res.body ?? []))
      .pipe(
        map((professeurs: IProfesseur[]) =>
          this.professeurService.addProfesseurToCollectionIfMissing<IProfesseur>(professeurs, ...(this.classe?.professeurs ?? [])),
        ),
      )
      .subscribe((professeurs: IProfesseur[]) => (this.professeursSharedCollection = professeurs));
  }
}
