import dayjs from 'dayjs/esm';
import { IUser } from 'app/entities/user/user.model';

export interface IBloodPressure {
  id: number;
  timestamp?: dayjs.Dayjs | null;
  systolic?: number | null;
  diastolic?: number | null;
  user?: Pick<IUser, 'id' | 'login'> | null;
}

export type NewBloodPressure = Omit<IBloodPressure, 'id'> & { id: null };
