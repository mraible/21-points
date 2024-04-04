import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IWeight, NewWeight } from '../weight.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IWeight for edit and NewWeightFormGroupInput for create.
 */
type WeightFormGroupInput = IWeight | PartialWithRequiredKeyOf<NewWeight>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IWeight | NewWeight> = Omit<T, 'timestamp'> & {
  timestamp?: string | null;
};

type WeightFormRawValue = FormValueOf<IWeight>;

type NewWeightFormRawValue = FormValueOf<NewWeight>;

type WeightFormDefaults = Pick<NewWeight, 'id' | 'timestamp'>;

type WeightFormGroupContent = {
  id: FormControl<WeightFormRawValue['id'] | NewWeight['id']>;
  timestamp: FormControl<WeightFormRawValue['timestamp']>;
  weight: FormControl<WeightFormRawValue['weight']>;
  user: FormControl<WeightFormRawValue['user']>;
};

export type WeightFormGroup = FormGroup<WeightFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class WeightFormService {
  createWeightFormGroup(weight: WeightFormGroupInput = { id: null }): WeightFormGroup {
    const weightRawValue = this.convertWeightToWeightRawValue({
      ...this.getFormDefaults(),
      ...weight,
    });
    return new FormGroup<WeightFormGroupContent>({
      id: new FormControl(
        { value: weightRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      timestamp: new FormControl(weightRawValue.timestamp, {
        validators: [Validators.required],
      }),
      weight: new FormControl(weightRawValue.weight, {
        validators: [Validators.required],
      }),
      user: new FormControl(weightRawValue.user),
    });
  }

  getWeight(form: WeightFormGroup): IWeight | NewWeight {
    return this.convertWeightRawValueToWeight(form.getRawValue() as WeightFormRawValue | NewWeightFormRawValue);
  }

  resetForm(form: WeightFormGroup, weight: WeightFormGroupInput): void {
    const weightRawValue = this.convertWeightToWeightRawValue({ ...this.getFormDefaults(), ...weight });
    form.reset(
      {
        ...weightRawValue,
        id: { value: weightRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): WeightFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      timestamp: currentTime,
    };
  }

  private convertWeightRawValueToWeight(rawWeight: WeightFormRawValue | NewWeightFormRawValue): IWeight | NewWeight {
    return {
      ...rawWeight,
      timestamp: dayjs(rawWeight.timestamp, DATE_TIME_FORMAT),
    };
  }

  private convertWeightToWeightRawValue(
    weight: IWeight | (Partial<NewWeight> & WeightFormDefaults)
  ): WeightFormRawValue | PartialWithRequiredKeyOf<NewWeightFormRawValue> {
    return {
      ...weight,
      timestamp: weight.timestamp ? weight.timestamp.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
