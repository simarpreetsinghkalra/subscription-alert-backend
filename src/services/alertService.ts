import { IAlert, AlertModel} from './../models';

const createAlert = (alert: IAlert) => {
    const newAlert  = new AlertModel(alert);
    return newAlert.save();
}

const getAlert = (alertId: string) => {
    return AlertModel.findById(alertId).exec();
}

const updateAlert = (alert: IAlert) => {
    return AlertModel.findByIdAndUpdate(alert._id, alert).exec()
}

const deleteAlert = (alertId: IAlert) => {
    return AlertModel.findByIdAndDelete(alertId).exec();
}

export const alertService = {
    createAlert,
    getAlert,
    updateAlert,
    deleteAlert,
}