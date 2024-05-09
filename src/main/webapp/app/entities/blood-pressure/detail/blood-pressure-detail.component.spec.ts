import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { BloodPressureDetailComponent } from './blood-pressure-detail.component';

describe('BloodPressure Management Detail Component', () => {
  let comp: BloodPressureDetailComponent;
  let fixture: ComponentFixture<BloodPressureDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BloodPressureDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ bloodPressure: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(BloodPressureDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(BloodPressureDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load bloodPressure on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.bloodPressure).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
