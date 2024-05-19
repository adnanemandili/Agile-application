import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject, from } from 'rxjs';

import { IClasse } from 'app/entities/classe/classe.model';
import { ClasseService } from 'app/entities/classe/service/classe.service';
import { EtudiantService } from '../service/etudiant.service';
import { IEtudiant } from '../etudiant.model';
import { EtudiantFormService } from './etudiant-form.service';

import { EtudiantUpdateComponent } from './etudiant-update.component';

describe('Etudiant Management Update Component', () => {
  let comp: EtudiantUpdateComponent;
  let fixture: ComponentFixture<EtudiantUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let etudiantFormService: EtudiantFormService;
  let etudiantService: EtudiantService;
  let classeService: ClasseService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, EtudiantUpdateComponent],
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
      .overrideTemplate(EtudiantUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(EtudiantUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    etudiantFormService = TestBed.inject(EtudiantFormService);
    etudiantService = TestBed.inject(EtudiantService);
    classeService = TestBed.inject(ClasseService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Classe query and add missing value', () => {
      const etudiant: IEtudiant = { id: 456 };
      const classe: IClasse = { id: 5004 };
      etudiant.classe = classe;

      const classeCollection: IClasse[] = [{ id: 32765 }];
      jest.spyOn(classeService, 'query').mockReturnValue(of(new HttpResponse({ body: classeCollection })));
      const additionalClasses = [classe];
      const expectedCollection: IClasse[] = [...additionalClasses, ...classeCollection];
      jest.spyOn(classeService, 'addClasseToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ etudiant });
      comp.ngOnInit();

      expect(classeService.query).toHaveBeenCalled();
      expect(classeService.addClasseToCollectionIfMissing).toHaveBeenCalledWith(
        classeCollection,
        ...additionalClasses.map(expect.objectContaining),
      );
      expect(comp.classesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const etudiant: IEtudiant = { id: 456 };
      const classe: IClasse = { id: 16580 };
      etudiant.classe = classe;

      activatedRoute.data = of({ etudiant });
      comp.ngOnInit();

      expect(comp.classesSharedCollection).toContain(classe);
      expect(comp.etudiant).toEqual(etudiant);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IEtudiant>>();
      const etudiant = { id: 123 };
      jest.spyOn(etudiantFormService, 'getEtudiant').mockReturnValue(etudiant);
      jest.spyOn(etudiantService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ etudiant });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: etudiant }));
      saveSubject.complete();

      // THEN
      expect(etudiantFormService.getEtudiant).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(etudiantService.update).toHaveBeenCalledWith(expect.objectContaining(etudiant));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IEtudiant>>();
      const etudiant = { id: 123 };
      jest.spyOn(etudiantFormService, 'getEtudiant').mockReturnValue({ id: null });
      jest.spyOn(etudiantService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ etudiant: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: etudiant }));
      saveSubject.complete();

      // THEN
      expect(etudiantFormService.getEtudiant).toHaveBeenCalled();
      expect(etudiantService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IEtudiant>>();
      const etudiant = { id: 123 };
      jest.spyOn(etudiantService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ etudiant });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(etudiantService.update).toHaveBeenCalled();
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
