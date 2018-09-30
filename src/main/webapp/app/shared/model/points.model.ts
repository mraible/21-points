import { Moment } from 'moment';
import { IUser } from 'app/core/user/user.model';

export interface IPoints {
    id?: number;
    date?: Moment;
    exercise?: number;
    meals?: number;
    alcohol?: number;
    notes?: string;
    user?: IUser;
}

export class Points implements IPoints {
    constructor(
        public id?: number,
        public date?: Moment,
        public exercise?: number,
        public meals?: number,
        public alcohol?: number,
        public notes?: string,
        public user?: IUser
    ) {}
}
