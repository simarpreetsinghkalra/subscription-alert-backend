import { RecurringAlertType, IUser, IAlert, recurringAlertTypes } from './models';
import mongoose, { Schema } from 'mongoose';

const userSchema = new Schema({
    name: { type: String, required: [true, 'Hey, Please tell us who you are.'] },
    email: { type: String, unique: true, required: [true, 'Please provide a valid email address.'] },
    password: { type: String, required: [true, 'Password is Required'], select: false },
    createdOn: { type: Date, default: Date.now() },
    refreshToken: {type: String, required: false, select: false},
    alerts: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'Alert' }
    ]
});

const UserModel = mongoose.model<IUser>('User', userSchema);

const alertSchema = new Schema({
    serviceName: { type: String, required: [true, 'What service is this reminder for?'] },
    remindBefore: { type: Number, required: [true, 'When do you want us to remind yo?'] },
    expiryDate: { type: Date, required: [true, 'When does this service expires?'] },
    reccuring: { type: String, default: RecurringAlertType.none, enum: recurringAlertTypes },
    createdOn: { type: Date, default: Date.now() },
});

const AlertModel = mongoose.model<IAlert>('Alert', alertSchema);

export {
    UserModel,
    AlertModel
}