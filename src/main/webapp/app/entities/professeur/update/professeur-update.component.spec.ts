import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject, from } from 'rxjs';

import { IClasse } from 'app/entities/classe/classe.model';
import { ClasseService } from 'app/entities/classe/service/classe.service';
import { ProfesseurService } from '../service/professeur.service';
import { IProfesseur } from '../professeur.model';
import { ProfesseurFormService } from './professeur-form.service';

import { ProfesseurUpdateComponent } from './professeur-update.component';

describe('Professeur Management Update Component', () => {
  let comp: ProfesseurUpdateComponent;
  let fixture: ComponentFixture<ProfesseurUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let professeurFormService: ProfesseurFormService;
  let professeurService: ProfesseurService;
  let classeService: ClasseService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, ProfesseurUpdateComponent],
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
      .overrideTemplate(ProfesseurUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ProfesseurUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    professeurFormService = TestBed.inject(ProfesseurFormService);
    professeurService = TestBed.inject(ProfesseurService);
    classeService = TestBed.inject(ClasseService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Classe query and add missing value', () => {
      const professeur: IProfesseur = { id: 456 };
      const classes: IClasse[] = [{ id: 5086 }];
      professeur.classes = classes;

      const classeCollection: IClasse[] = [{ id: 29419 }];
      jest.spyOn(classeService, 'query').mockReturnValue(of(new HttpResponse({ body: classeCollection })));
      const additionalClasses = [...classes];
      const expectedCollection: IClasse[] = [...additionalClasses, ...classeCollection];
      jest.spyOn(classeService, 'addClasseToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ professeur });
      comp.ngOnInit();

      expect(classeService.query).toHaveBeenCalled();
      expect(classeService.addClasseToCollectionIfMissing).toHaveBeenCalledWith(
        classeCollection,
        ...additionalClasses.map(expect.objectContaining),
      );
      expect(comp.classesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const professeur: IProfesseur = { id: 456 };
      const classe: IClasse = { id: 4314 };
      professeur.classes = [classe];

      activatedRoute.data = of({ professeur });
      comp.ngOnInit();

      expect(comp.classesSharedCollection).toContain(classe);
      expect(comp.professeur).toEqual(professeur);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IProfesseur>>();
      const professeur = { id: 123 };
      jest.spyOn(professeurFormService, 'getProfesseur').mockReturnValue(professeur);
      jest.spyOn(professeurService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ professeur });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: professeur }));
      saveSubject.complete();

      // THEN
      expect(professeurFormService.getProfesseur).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(professeurService.update).toHaveBeenCalledWith(expect.objectContaining(professeur));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IProfesseur>>();
      const professeur = { id: 123 };
      jest.spyOn(professeurFormService, 'getProfesseur').mockReturnValue({ id: null });
      jest.spyOn(professeurService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ professeur: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: professeur }));
      saveSubject.complete();

      // THEN
      expect(professeurFormService.getProfesseur).toHaveBeenCalled();
      expect(professeurService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IProfesseur>>();
      const professeur = { id: 123 };
      jest.spyOn(professeurService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ professeur });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(professeurService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareClasse', () => {
      it('Should forward to classeService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(classeService, 'compareClasse');
        comp.compareClasse(entity, entity2);
        expect(classeService.compareClasse).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
