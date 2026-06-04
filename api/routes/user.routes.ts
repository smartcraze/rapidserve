import { Router } from 'express';
import {
    LoginController,
    LogoutController,
    SignupController
} from '../controller/user.controller';
import { ForgotPasswordController } from '../controller/reset-password';
import { ResetPasswordController } from '../controller/reset-password';
import { passwordResetRateLimit } from '../middleware/ratelimit';
import { authMiddleware } from '../middleware/auth.middleware';
const userRouter = Router();

userRouter.post('/signup', SignupController);
userRouter.post('/login', LoginController);

userRouter.use(authMiddleware);
userRouter.post('/logout', LogoutController);
userRouter.post('/forgot-password', passwordResetRateLimit, ForgotPasswordController);
userRouter.post('/reset-password', passwordResetRateLimit, ResetPasswordController);


export { userRouter };