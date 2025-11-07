import express from 'express';
import { authenticate } from '../../middlewares/auth/auth.ts';
import type { Request, Response } from 'express';


const router = express.Router();

router.get('/profile', authenticate, (req: Request, res: Response) => {
    //   res.json({ message: `Welcome ${req.user.username}` });
    res.json({ message: `Welcome ${req}` });
});

export default router;