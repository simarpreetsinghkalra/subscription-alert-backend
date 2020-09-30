import { alertService } from '../services';
import { IAlert } from '../models';
import { Request, Response } from 'express';

const newAlert = async (req: Request, res: Response) => {
    const user = req.body.user.userId;
    const alert: IAlert = req.body.data;
    const createdAlert = await alertService.createAlert(alert);

}