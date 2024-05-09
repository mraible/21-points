import { IPreferences, NewPreferences } from './preferences.model';

export const sampleWithRequiredData: IPreferences = {
  id: 11210,
  weeklyGoal: 16,
  weightUnits: 'LB',
};

export const sampleWithPartialData: IPreferences = {
  id: 8696,
  weeklyGoal: 20,
  weightUnits: 'LB',
};

export const sampleWithFullData: IPreferences = {
  id: 14979,
  weeklyGoal: 15,
  weightUnits: 'LB',
};

export const sampleWithNewData: NewPreferences = {
  weeklyGoal: 21,
  weightUnits: 'KG',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
