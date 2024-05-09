import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { of } from 'rxjs';

import { PreferencesDetailComponent } from './preferences-detail.component';

describe('Preferences Management Detail Component', () => {
  let comp: PreferencesDetailComponent;
  let fixture: ComponentFixture<PreferencesDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreferencesDetailComponent],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: PreferencesDetailComponent,
              resolve: { preferences: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(PreferencesDetailComponent, '')
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PreferencesDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load preferences on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', PreferencesDetailComponent);

      // THEN
      expect(instance.preferences()).toEqual(expect.objectContaining({ id: 123 }));
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
