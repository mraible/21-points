import { IAuthority, NewAuthority } from './authority.model';

export const sampleWithRequiredData: IAuthority = {
  name: '438d0575-6c2e-4058-bbb8-ae982b8cc151',
};

export const sampleWithPartialData: IAuthority = {
  name: '6023847d-0ad6-4c31-ab0b-0aa44163270b',
};

export const sampleWithFullData: IAuthority = {
  name: '5164f5b0-1d63-44a1-8ce2-489a598e7b92',
};

export const sampleWithNewData: NewAuthority = {
  name: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
