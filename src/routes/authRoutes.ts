import express from 'express';

import { authCtrl } from './../controllers';
import { authService } from './../services';

const authRouter = express.Router({mergeParams: true});

authRouter.post('/api/auth/login', authCtrl.loginUser);
authRouter.post('/api/auth/tokens', authCtrl.refreshToken);
authRouter.delete('/api/auth/logout', authService.authenticateToken, authCtrl.logoutUser);

export default authRouter;