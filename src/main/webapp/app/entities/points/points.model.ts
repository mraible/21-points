import dayjs from 'dayjs/esm';
import { IUser } from 'app/entities/user/user.model';

export interface IPoints {
  id: number;
  date?: dayjs.Dayjs | null;
  exercise?: number | null;
  meals?: number | null;
  alcohol?: number | null;
  notes?: string | null;
  user?: Pick<IUser, 'id' | 'login'> | null;
}

export type NewPoints = Omit<IPoints, 'id'> & { id: null };
