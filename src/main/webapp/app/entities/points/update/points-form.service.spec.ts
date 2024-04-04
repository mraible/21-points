import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../points.test-samples';

import { PointsFormService } from './points-form.service';

describe('Points Form Service', () => {
  let service: PointsFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PointsFormService);
  });

  describe('Service methods', () => {
    describe('createPointsFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createPointsFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            date: expect.any(Object),
            exercise: expect.any(Object),
            meals: expect.any(Object),
            alcohol: expect.any(Object),
            notes: expect.any(Object),
            user: expect.any(Object),
          })
        );
      });

      it('passing IPoints should create a new form with FormGroup', () => {
        const formGroup = service.createPointsFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            date: expect.any(Object),
            exercise: expect.any(Object),
            meals: expect.any(Object),
            alcohol: expect.any(Object),
            notes: expect.any(Object),
            user: expect.any(Object),
          })
        );
      });
    });

    describe('getPoints', () => {
      it('should return NewPoints for default Points initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createPointsFormGroup(sampleWithNewData);

        const points = service.getPoints(formGroup) as any;

        expect(points).toMatchObject(sampleWithNewData);
      });

      it('should return NewPoints for empty Points initial value', () => {
        const formGroup = service.createPointsFormGroup();

        const points = service.getPoints(formGroup) as any;

        expect(points).toMatchObject({});
      });

      it('should return IPoints', () => {
        const formGroup = service.createPointsFormGroup(sampleWithRequiredData);

        const points = service.getPoints(formGroup) as any;

        expect(points).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IPoints should not enable id FormControl', () => {
        const formGroup = service.createPointsFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewPoints should disable id FormControl', () => {
        const formGroup = service.createPointsFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
