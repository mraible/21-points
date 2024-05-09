import dayjs from 'dayjs/esm';

import { IWeight, NewWeight } from './weight.model';

export const sampleWithRequiredData: IWeight = {
  id: 4890,
  timestamp: dayjs('2022-11-07T07:25'),
  weight: 24215.41,
};

export const sampleWithPartialData: IWeight = {
  id: 1135,
  timestamp: dayjs('2022-11-07T23:09'),
  weight: 17356.05,
};

export const sampleWithFullData: IWeight = {
  id: 603,
  timestamp: dayjs('2022-11-07T10:41'),
  weight: 25306.98,
};

export const sampleWithNewData: NewWeight = {
  timestamp: dayjs('2022-11-07T17:04'),
  weight: 28535.16,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
