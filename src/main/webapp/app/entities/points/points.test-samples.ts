import dayjs from 'dayjs/esm';

import { IPoints, NewPoints } from './points.model';

export const sampleWithRequiredData: IPoints = {
  id: 9073,
  date: dayjs('2022-11-07'),
};

export const sampleWithPartialData: IPoints = {
  id: 24615,
  date: dayjs('2022-11-07'),
  meals: 11206,
};

export const sampleWithFullData: IPoints = {
  id: 641,
  date: dayjs('2022-11-07'),
  exercise: 30617,
  meals: 12944,
  alcohol: 16487,
  notes: 'amidst',
};

export const sampleWithNewData: NewPoints = {
  date: dayjs('2022-11-07'),
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
