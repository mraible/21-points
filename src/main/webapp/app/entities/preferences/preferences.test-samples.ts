import { Units } from 'app/entities/enumerations/units.model';

import { IPreferences, NewPreferences } from './preferences.model';

export const sampleWithRequiredData: IPreferences = {
  id: 97604,
  weeklyGoal: 13,
  weightUnits: Units['LB'],
};

export const sampleWithPartialData: IPreferences = {
  id: 73829,
  weeklyGoal: 12,
  weightUnits: Units['KG'],
};

export const sampleWithFullData: IPreferences = {
  id: 80916,
  weeklyGoal: 18,
  weightUnits: Units['KG'],
};

export const sampleWithNewData: NewPreferences = {
  weeklyGoal: 14,
  weightUnits: Units['LB'],
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
