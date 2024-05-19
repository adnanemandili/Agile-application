import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject, from } from 'rxjs';

import { IProfesseur } from 'app/entities/professeur/professeur.model';
import { ProfesseurService } from 'app/entities/professeur/service/professeur.service';
import { ClasseService } from '../service/classe.service';
import { IClasse } from '../classe.model';
import { ClasseFormService } from './classe-form.service';

import { ClasseUpdateComponent } from './classe-update.component';

describe('Classe Management Update Component', () => {
  let comp: ClasseUpdateComponent;
  let fixture: ComponentFixture<ClasseUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let classeFormService: ClasseFormService;
  let classeService: ClasseService;
  let professeurService: ProfesseurService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, ClasseUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(ClasseUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ClasseUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    classeFormService = TestBed.inject(ClasseFormService);
    classeService = TestBed.inject(ClasseService);
    professeurService = TestBed.inject(ProfesseurService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Professeur query and add missing value', () => {
      const classe: IClasse = { id: 456 };
      const professeurs: IProfesseur[] = [{ id: 13628 }];
      classe.professeurs = professeurs;

      const professeurCollection: IProfesseur[] = [{ id: 4041 }];
      jest.spyOn(professeurService, 'query').mockReturnValue(of(new HttpResponse({ body: professeurCollection })));
      const additionalProfesseurs = [...professeurs];
      const expectedCollection: IProfesseur[] = [...additionalProfesseurs, ...professeurCollection];
      jest.spyOn(professeurService, 'addProfesseurToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ classe });
      comp.ngOnInit();

      expect(professeurService.query).toHaveBeenCalled();
      expect(professeurService.addProfesseurToCollectionIfMissing).toHaveBeenCalledWith(
        professeurCollection,
        ...additionalProfesseurs.map(expect.objectContaining),
      );
      expect(comp.professeursSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const classe: IClasse = { id: 456 };
      const professeur: IProfesseur = { id: 8252 };
      classe.professeurs = [professeur];

      activatedRoute.data = of({ classe });
      comp.ngOnInit();

      expect(comp.professeursSharedCollection).toContain(professeur);
      expect(comp.classe).toEqual(classe);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IClasse>>();
      const classe = { id: 123 };
      jest.spyOn(classeFormService, 'getClasse').mockReturnValue(classe);
      jest.spyOn(classeService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ classe });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: classe }));
      saveSubject.complete();

      // THEN
      expect(classeFormService.getClasse).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(classeService.update).toHaveBeenCalledWith(expect.objectContaining(classe));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IClasse>>();
      const classe = { id: 123 };
      jest.spyOn(classeFormService, 'getClasse').mockReturnValue({ id: null });
      jest.spyOn(classeService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ classe: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: classe }));
      saveSubject.complete();

      // THEN
      expect(classeFormService.getClasse).toHaveBeenCalled();
      expect(classeService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IClasse>>();
      const classe = { id: 123 };
      jest.spyOn(classeService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ classe });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(classeService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareProfesseur', () => {
      it('Should forward to professeurService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(professeurService, 'compareProfesseur');
        comp.compareProfesseur(entity, entity2);
        expect(professeurService.compareProfesseur).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
