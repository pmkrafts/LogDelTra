import Order from '../../models/order.ts';
import type { Request, Response, NextFunction } from 'express';


// Create a new order
const createOrder = async (req: Request, res: Response, next: NextFunction) => {
    const { customerId, items, dropAddressNo } = req.body;

    try {
        const order = new Order({ customerId, items, dropAddressNo });
        await order.save();
        res.json({ message: 'Order placed' });
    } catch (error) {
        next(error);
    }
};

// update an existing order
const updateOrder = async (req: Request, res: Response, next: NextFunction) => {
    const { orderId, updates } = req.body;

    try {
        const order = await Order.findOne({ orderId });
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        next(error);
    }
};

export { createOrder, updateOrder };