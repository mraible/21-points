import dayjs from 'dayjs/esm';

import { IBloodPressure, NewBloodPressure } from './blood-pressure.model';

export const sampleWithRequiredData: IBloodPressure = {
  id: 32603,
  timestamp: dayjs('2022-11-07T19:13'),
  systolic: 15738,
  diastolic: 12747,
};

export const sampleWithPartialData: IBloodPressure = {
  id: 20800,
  timestamp: dayjs('2022-11-07T12:31'),
  systolic: 20448,
  diastolic: 11748,
};

export const sampleWithFullData: IBloodPressure = {
  id: 22524,
  timestamp: dayjs('2022-11-07T01:08'),
  systolic: 7115,
  diastolic: 10995,
};

export const sampleWithNewData: NewBloodPressure = {
  timestamp: dayjs('2022-11-07T00:24'),
  systolic: 8004,
  diastolic: 3889,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
