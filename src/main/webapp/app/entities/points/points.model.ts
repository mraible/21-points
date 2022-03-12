import dayjs from 'dayjs/esm';
import { IUser } from 'app/entities/user/user.model';

export interface IPoints {
  id?: number;
  date?: dayjs.Dayjs;
  exercise?: number | null;
  meals?: number | null;
  alcohol?: number | null;
  notes?: string | null;
  user?: IUser | null;
}

export class Points implements IPoints {
  constructor(
    public id?: number,
    public date?: dayjs.Dayjs,
    public exercise?: number | null,
    public meals?: number | null,
    public alcohol?: number | null,
    public notes?: string | null,
    public user?: IUser | null
  ) {}
}

export function getPointsIdentifier(points: IPoints): number | undefined {
  return points.id;
}
