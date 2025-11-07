import express from 'express';
import { authenticate } from '../../middlewares/auth/auth.ts';
import { createOrder } from '../../controllers/order/index.ts';


const router = express.Router();

router.put('/order', authenticate, createOrder);

export default router;