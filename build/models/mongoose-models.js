"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlertModel = exports.UserModel = void 0;
var mongoose_1 = __importStar(require("mongoose"));
var userSchema = new mongoose_1.Schema({
    name: { type: String, required: [true, 'Hey, Please tell us who you are.'] },
    email: { type: String, unique: true, required: [true, 'Please provide a valid email address.'] },
    password: { type: String, required: [true, 'Password is Required'] },
    createdOn: { type: Date, default: Date.now() },
    alerts: [
        { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Alert' }
    ]
});
var UserModel = mongoose_1.default.model('User', userSchema);
exports.UserModel = UserModel;
var alertSchema = new mongoose_1.Schema({
    serviceName: { type: String, required: [true, 'What service is this reminder for?'] },
    remindBefore: { type: Number, required: [true, 'When do you want us to remind yo?'] },
    expiryDate: { type: Date, required: [true, 'When does this service expires?'] },
    reccuring: { type: String, default: 'NONE', enum: ['NONE', 'WEEKLY', 'MONTHLY', 'YEARLY'] },
    createdOn: { type: Date, default: Date.now() },
});
var AlertModel = mongoose_1.default.model('Alert', alertSchema);
exports.AlertModel = AlertModel;
