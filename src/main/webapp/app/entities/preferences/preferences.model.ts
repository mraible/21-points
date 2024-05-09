import { IUser } from 'app/entities/user/user.model';
import { Units } from 'app/entities/enumerations/units.model';

export interface IPreferences {
  id: number;
  weeklyGoal?: number | null;
  weightUnits?: Units | null;
  user?: Pick<IUser, 'id' | 'login'> | null;
}

export type NewPreferences = Omit<IPreferences, 'id'> & { id: null };
