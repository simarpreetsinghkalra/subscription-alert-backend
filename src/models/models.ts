import { Document } from "mongoose";

export interface IUser extends Document {
    name: String;
    email: String;
    password: String;
    createdOn: Date;
    alerts?: IAlert['_id'][];
}

export interface IAlert extends Document {
    serviceName: String;
    remindBefore: Number;
    expiryDate: Date;
    reccuring: RecurringAlertType;
    createdOn: Date;
}

export interface ApiResponse<T> {
    status: String;
    message: String;
    data: T;
}

export enum RecurringAlertType {
    none = 'NONE',
    weekly = 'WEEKLY',
    monthly = 'MONTHLY',
    yearly = 'YEARLY'
}