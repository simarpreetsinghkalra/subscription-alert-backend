import { Document } from "mongoose";

export interface IUser extends Document {
    name: String;
    email: String;
    password?: String;
    createdOn: Date;
    refreshToken?: String;
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
    success: boolean;
    message: String;
    data: T;
}

export enum RecurringAlertType {
    none = 'NONE',
    weekly = 'WEEKLY',
    monthly = 'MONTHLY',
    yearly = 'YEARLY'
}

export const recurringAlertTypes = ['NONE', 'WEEKLY', 'MONTHLY', 'YEARLY'];