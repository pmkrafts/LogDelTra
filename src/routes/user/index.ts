import express from 'express';
import { authenticate } from '../../middlewares/auth/index.ts';
import type { Request, Response } from 'express';
import { addUserLocation } from '../../controllers/user/index.ts';


const router = express.Router();

router.get('/profile', authenticate, (req: Request, res: Response) => {
    //   res.json({ message: `Welcome ${req.user.username}` });
    res.json({ message: `Welcome ${req}` });
});

router.post('/profile/update', authenticate, addUserLocation);

export default router;