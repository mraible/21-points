import dayjs from 'dayjs/esm';
import { IUser } from 'app/entities/user/user.model';

export interface IBloodPressure {
  id?: number;
  timestamp?: dayjs.Dayjs;
  systolic?: number;
  diastolic?: number;
  user?: IUser | null;
}

export class BloodPressure implements IBloodPressure {
  constructor(
    public id?: number,
    public timestamp?: dayjs.Dayjs,
    public systolic?: number,
    public diastolic?: number,
    public user?: IUser | null
  ) {}
}

export function getBloodPressureIdentifier(bloodPressure: IBloodPressure): number | undefined {
  return bloodPressure.id;
}
