import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { of } from 'rxjs';

import { MatiereDetailComponent } from './matiere-detail.component';

describe('Matiere Management Detail Component', () => {
  let comp: MatiereDetailComponent;
  let fixture: ComponentFixture<MatiereDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatiereDetailComponent],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: MatiereDetailComponent,
              resolve: { matiere: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(MatiereDetailComponent, '')
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MatiereDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load matiere on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', MatiereDetailComponent);

      // THEN
      expect(instance.matiere()).toEqual(expect.objectContaining({ id: 123 }));
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
