import { IUser } from './user.model';

export const sampleWithRequiredData: IUser = {
  id: 336,
  login: 'dMUa~@bSCRjq\\#ND-K3-',
};

export const sampleWithPartialData: IUser = {
  id: 13843,
  login: 'by',
};

export const sampleWithFullData: IUser = {
  id: 6007,
  login: '9iF=@l\\_R411',
};
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
