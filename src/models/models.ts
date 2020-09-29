import { Document } from "mongoose";

export interface IUser extends Document {
    name: string;
    email: string;
    password?: string;
    createdOn: Date;
    refreshToken?: string;
    alerts?: IAlert['_id'][];
}

export interface IAlert extends Document {
    serviceName: string;
    remindBefore: Number;
    expiryDate: Date;
    reccuring: RecurringAlertType;
    createdOn: Date;
}

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

export enum RecurringAlertType {
    none = 'NONE',
    weekly = 'WEEKLY',
    monthly = 'MONTHLY',
    yearly = 'YEARLY'
}

export const recurringAlertTypes = ['NONE', 'WEEKLY', 'MONTHLY', 'YEARLY'];