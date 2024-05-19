import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { of } from 'rxjs';

import { EtudiantDetailComponent } from './etudiant-detail.component';

describe('Etudiant Management Detail Component', () => {
  let comp: EtudiantDetailComponent;
  let fixture: ComponentFixture<EtudiantDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EtudiantDetailComponent],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: EtudiantDetailComponent,
              resolve: { etudiant: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(EtudiantDetailComponent, '')
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EtudiantDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load etudiant on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', EtudiantDetailComponent);

      // THEN
      expect(instance.etudiant()).toEqual(expect.objectContaining({ id: 123 }));
    });
  });

  describe('PreviousState', () => {
    it('Should navigate to previous state', () => {
      jest.spyOn(window.history, 'back');
      comp.previousState();
      expect(window.history.back).toHaveBeenCalled();
    });
  });
});
