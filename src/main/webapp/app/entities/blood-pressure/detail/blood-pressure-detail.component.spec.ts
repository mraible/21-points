import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { of } from 'rxjs';

import { BloodPressureDetailComponent } from './blood-pressure-detail.component';

describe('BloodPressure Management Detail Component', () => {
  let comp: BloodPressureDetailComponent;
  let fixture: ComponentFixture<BloodPressureDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BloodPressureDetailComponent],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: BloodPressureDetailComponent,
              resolve: { bloodPressure: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(BloodPressureDetailComponent, '')
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BloodPressureDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load bloodPressure on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', BloodPressureDetailComponent);

      // THEN
      expect(instance.bloodPressure()).toEqual(expect.objectContaining({ id: 123 }));
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
