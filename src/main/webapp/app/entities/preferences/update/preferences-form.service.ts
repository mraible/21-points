import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IPreferences, NewPreferences } from '../preferences.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IPreferences for edit and NewPreferencesFormGroupInput for create.
 */
type PreferencesFormGroupInput = IPreferences | PartialWithRequiredKeyOf<NewPreferences>;

type PreferencesFormDefaults = Pick<NewPreferences, 'id'>;

type PreferencesFormGroupContent = {
  id: FormControl<IPreferences['id'] | NewPreferences['id']>;
  weeklyGoal: FormControl<IPreferences['weeklyGoal']>;
  weightUnits: FormControl<IPreferences['weightUnits']>;
  user: FormControl<IPreferences['user']>;
};

export type PreferencesFormGroup = FormGroup<PreferencesFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class PreferencesFormService {
  createPreferencesFormGroup(preferences: PreferencesFormGroupInput = { id: null }): PreferencesFormGroup {
    const preferencesRawValue = {
      ...this.getFormDefaults(),
      ...preferences,
    };
    return new FormGroup<PreferencesFormGroupContent>({
      id: new FormControl(
        { value: preferencesRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      weeklyGoal: new FormControl(preferencesRawValue.weeklyGoal, {
        validators: [Validators.required, Validators.min(10), Validators.max(21)],
      }),
      weightUnits: new FormControl(preferencesRawValue.weightUnits, {
        validators: [Validators.required],
      }),
      user: new FormControl(preferencesRawValue.user),
    });
  }

  getPreferences(form: PreferencesFormGroup): IPreferences | NewPreferences {
    return form.getRawValue() as IPreferences | NewPreferences;
  }

  resetForm(form: PreferencesFormGroup, preferences: PreferencesFormGroupInput): void {
    const preferencesRawValue = { ...this.getFormDefaults(), ...preferences };
    form.reset(
      {
        ...preferencesRawValue,
        id: { value: preferencesRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): PreferencesFormDefaults {
    return {
      id: null,
    };
  }
}
