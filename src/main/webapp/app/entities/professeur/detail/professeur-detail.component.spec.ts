import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { of } from 'rxjs';

import { ProfesseurDetailComponent } from './professeur-detail.component';

describe('Professeur Management Detail Component', () => {
  let comp: ProfesseurDetailComponent;
  let fixture: ComponentFixture<ProfesseurDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfesseurDetailComponent],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: ProfesseurDetailComponent,
              resolve: { professeur: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(ProfesseurDetailComponent, '')
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfesseurDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load professeur on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', ProfesseurDetailComponent);

      // THEN
      expect(instance.professeur()).toEqual(expect.objectContaining({ id: 123 }));
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
