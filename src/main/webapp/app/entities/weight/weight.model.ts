import dayjs from 'dayjs/esm';
import { IUser } from 'app/entities/user/user.model';

export interface IWeight {
  id: number;
  timestamp?: dayjs.Dayjs | null;
  weight?: number | null;
  user?: Pick<IUser, 'id' | 'login'> | null;
}

export type NewWeight = Omit<IWeight, 'id'> & { id: null };
