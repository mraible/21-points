import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../weight.test-samples';

import { WeightFormService } from './weight-form.service';

describe('Weight Form Service', () => {
  let service: WeightFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WeightFormService);
  });

  describe('Service methods', () => {
    describe('createWeightFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createWeightFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            timestamp: expect.any(Object),
            weight: expect.any(Object),
            user: expect.any(Object),
          })
        );
      });

      it('passing IWeight should create a new form with FormGroup', () => {
        const formGroup = service.createWeightFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            timestamp: expect.any(Object),
            weight: expect.any(Object),
            user: expect.any(Object),
          })
        );
      });
    });

    describe('getWeight', () => {
      it('should return NewWeight for default Weight initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createWeightFormGroup(sampleWithNewData);

        const weight = service.getWeight(formGroup) as any;

        expect(weight).toMatchObject(sampleWithNewData);
      });

      it('should return NewWeight for empty Weight initial value', () => {
        const formGroup = service.createWeightFormGroup();

        const weight = service.getWeight(formGroup) as any;

        expect(weight).toMatchObject({});
      });

      it('should return IWeight', () => {
        const formGroup = service.createWeightFormGroup(sampleWithRequiredData);

        const weight = service.getWeight(formGroup) as any;

        expect(weight).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IWeight should not enable id FormControl', () => {
        const formGroup = service.createWeightFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewWeight should disable id FormControl', () => {
        const formGroup = service.createWeightFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
