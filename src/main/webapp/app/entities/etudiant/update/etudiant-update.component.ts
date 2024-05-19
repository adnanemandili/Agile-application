import { Component, inject, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IClasse } from 'app/entities/classe/classe.model';
import { ClasseService } from 'app/entities/classe/service/classe.service';
import { Niveau } from 'app/entities/enumerations/niveau.model';
import { Filiere } from 'app/entities/enumerations/filiere.model';
import { EtudiantService } from '../service/etudiant.service';
import { IEtudiant } from '../etudiant.model';
import { EtudiantFormService, EtudiantFormGroup } from './etudiant-form.service';

@Component({
  standalone: true,
  selector: 'jhi-etudiant-update',
  templateUrl: './etudiant-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class EtudiantUpdateComponent implements OnInit {
  isSaving = false;
  etudiant: IEtudiant | null = null;
  niveauValues = Object.keys(Niveau);
  filiereValues = Object.keys(Filiere);

  classesSharedCollection: IClasse[] = [];

  protected etudiantService = inject(EtudiantService);
  protected etudiantFormService = inject(EtudiantFormService);
  protected classeService = inject(ClasseService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: EtudiantFormGroup = this.etudiantFormService.createEtudiantFormGroup();

  compareClasse = (o1: IClasse | null, o2: IClasse | null): boolean => this.classeService.compareClasse(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ etudiant }) => {
      this.etudiant = etudiant;
      if (etudiant) {
        this.updateForm(etudiant);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const etudiant = this.etudiantFormService.getEtudiant(this.editForm);
    if (etudiant.id !== null) {
      this.subscribeToSaveResponse(this.etudiantService.update(etudiant));
    } else {
      this.subscribeToSaveResponse(this.etudiantService.create(etudiant));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IEtudiant>>): void {
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

  protected updateForm(etudiant: IEtudiant): void {
    this.etudiant = etudiant;
    this.etudiantFormService.resetForm(this.editForm, etudiant);

    this.classesSharedCollection = this.classeService.addClasseToCollectionIfMissing<IClasse>(
      this.classesSharedCollection,
      etudiant.classe,
    );
  }

  protected loadRelationshipsOptions(): void {
    this.classeService
      .query()
      .pipe(map((res: HttpResponse<IClasse[]>) => res.body ?? []))
      .pipe(map((classes: IClasse[]) => this.classeService.addClasseToCollectionIfMissing<IClasse>(classes, this.etudiant?.classe)))
      .subscribe((classes: IClasse[]) => (this.classesSharedCollection = classes));
  }
}
