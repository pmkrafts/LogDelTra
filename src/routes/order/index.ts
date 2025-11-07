import express from 'express';
import { authenticate } from '../../middlewares/auth/index.ts';
import { createOrder } from '../../controllers/order/index.ts';


const router = express.Router();

router.post('/create', authenticate, createOrder);

export default router;