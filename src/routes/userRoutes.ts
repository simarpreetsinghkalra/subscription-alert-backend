import { userCtrl } from './../controllers';
import express from 'express';


const userRouter = express.Router({mergeParams: true});


userRouter.post('/api/user', userCtrl.createUser);
userRouter.post('/api/user/login', userCtrl.loginUser);

export default userRouter;