import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { of } from 'rxjs';

import { ClasseDetailComponent } from './classe-detail.component';

describe('Classe Management Detail Component', () => {
  let comp: ClasseDetailComponent;
  let fixture: ComponentFixture<ClasseDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClasseDetailComponent],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: ClasseDetailComponent,
              resolve: { classe: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(ClasseDetailComponent, '')
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClasseDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load classe on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', ClasseDetailComponent);

      // THEN
      expect(instance.classe()).toEqual(expect.objectContaining({ id: 123 }));
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
