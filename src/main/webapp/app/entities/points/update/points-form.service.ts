import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IPoints, NewPoints } from '../points.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IPoints for edit and NewPointsFormGroupInput for create.
 */
type PointsFormGroupInput = IPoints | PartialWithRequiredKeyOf<NewPoints>;

type PointsFormDefaults = Pick<NewPoints, 'id'>;

type PointsFormGroupContent = {
  id: FormControl<IPoints['id'] | NewPoints['id']>;
  date: FormControl<IPoints['date']>;
  exercise: FormControl<IPoints['exercise']>;
  meals: FormControl<IPoints['meals']>;
  alcohol: FormControl<IPoints['alcohol']>;
  notes: FormControl<IPoints['notes']>;
  user: FormControl<IPoints['user']>;
};

export type PointsFormGroup = FormGroup<PointsFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class PointsFormService {
  createPointsFormGroup(points: PointsFormGroupInput = { id: null }): PointsFormGroup {
    const pointsRawValue = {
      ...this.getFormDefaults(),
      ...points,
    };
    return new FormGroup<PointsFormGroupContent>({
      id: new FormControl(
        { value: pointsRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      date: new FormControl(pointsRawValue.date, {
        validators: [Validators.required],
      }),
      exercise: new FormControl(pointsRawValue.exercise),
      meals: new FormControl(pointsRawValue.meals),
      alcohol: new FormControl(pointsRawValue.alcohol),
      notes: new FormControl(pointsRawValue.notes, {
        validators: [Validators.maxLength(140)],
      }),
      user: new FormControl(pointsRawValue.user),
    });
  }

  getPoints(form: PointsFormGroup): IPoints | NewPoints {
    return form.getRawValue() as IPoints | NewPoints;
  }

  resetForm(form: PointsFormGroup, points: PointsFormGroupInput): void {
    const pointsRawValue = { ...this.getFormDefaults(), ...points };
    form.reset(
      {
        ...pointsRawValue,
        id: { value: pointsRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): PointsFormDefaults {
    return {
      id: null,
    };
  }
}
