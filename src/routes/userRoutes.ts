import express from 'express';

import { authService } from '../services';
import { userCtrl } from './../controllers';


const userRouter = express.Router({mergeParams: true});


userRouter.post('/api/user', userCtrl.createUser);
userRouter.get('/api/user/profile', authService.authenticateToken, userCtrl.getUser);
userRouter.put('/api/user/forgetPassword', userCtrl.forgetPassword);
userRouter.put('/api/user/updatePassword', authService.authenticateToken, userCtrl.updatePassword);

export default userRouter;