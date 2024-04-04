import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../blood-pressure.test-samples';

import { BloodPressureFormService } from './blood-pressure-form.service';

describe('BloodPressure Form Service', () => {
  let service: BloodPressureFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BloodPressureFormService);
  });

  describe('Service methods', () => {
    describe('createBloodPressureFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createBloodPressureFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            timestamp: expect.any(Object),
            systolic: expect.any(Object),
            diastolic: expect.any(Object),
            user: expect.any(Object),
          })
        );
      });

      it('passing IBloodPressure should create a new form with FormGroup', () => {
        const formGroup = service.createBloodPressureFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            timestamp: expect.any(Object),
            systolic: expect.any(Object),
            diastolic: expect.any(Object),
            user: expect.any(Object),
          })
        );
      });
    });

    describe('getBloodPressure', () => {
      it('should return NewBloodPressure for default BloodPressure initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createBloodPressureFormGroup(sampleWithNewData);

        const bloodPressure = service.getBloodPressure(formGroup) as any;

        expect(bloodPressure).toMatchObject(sampleWithNewData);
      });

      it('should return NewBloodPressure for empty BloodPressure initial value', () => {
        const formGroup = service.createBloodPressureFormGroup();

        const bloodPressure = service.getBloodPressure(formGroup) as any;

        expect(bloodPressure).toMatchObject({});
      });

      it('should return IBloodPressure', () => {
        const formGroup = service.createBloodPressureFormGroup(sampleWithRequiredData);

        const bloodPressure = service.getBloodPressure(formGroup) as any;

        expect(bloodPressure).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IBloodPressure should not enable id FormControl', () => {
        const formGroup = service.createBloodPressureFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewBloodPressure should disable id FormControl', () => {
        const formGroup = service.createBloodPressureFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
