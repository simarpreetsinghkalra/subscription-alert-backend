import express from 'express';

import { authCtrl } from './../controllers';

const authRouter = express.Router({mergeParams: true});

authRouter.post('/api/auth/login', authCtrl.loginUser);
authRouter.post('/api/auth/tokens', authCtrl.refreshToken)

export default authRouter;