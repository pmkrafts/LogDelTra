import Order from '../../models/order.ts';
import type { Request, Response, NextFunction } from 'express';
import { getUserId } from '../../services/user/getUserId.ts';


/**
 * Creates a new order
 * @param req.body.emailId - Customer's email (e.g., "customer@example.com")
 * @param req.body.items - Array of order items (e.g., [{ productId: "123", quantity: 2 }])
 * @param req.body.dropAddressNo - Delivery address ID (e.g., "addr123")
 * @param res - Express Response object
 * @param next - Express NextFunction for error handling
 * @returns JSON response with message
 * @throws Forwards any errors to next() middleware
 * @example
 * POST /orders
 * {
 *   "emailId": "customer@example.com",
 *   "items": [{ "productId": "123", "quantity": 2 }],
 *   "dropAddressNo": "addr123"
 * }
 */
const createOrder = async (req: Request, res: Response, next: NextFunction) => {
    // console.log('Creating order with:', req.body);
    const { emailId, items, dropAddressNo } = req.body;

    try {
        const customerId = await getUserId(emailId);
        // console.log('customerId is', customerId);

        if (!customerId) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        const order = new Order({ customerId, items, dropAddressNo });
        await order.save();
        res.json({ message: 'Order placed' });
    } catch (error) {
        next(error);
    }
};

/**
 * Updates an existing order
 * @param req.body.orderId - Order ID to update (e.g., "order123")
 * @param req.body.updates - Object containing fields to update (e.g., { status: "shipped" })
 * @param res - Express Response object
 * @param next - Express NextFunction for error handling
 * @returns JSON response with message
 * @throws Forwards any errors to next() middleware
 * @example
 * PUT /orders
 * {
 *   "orderId": "order123",
 *   "updates": { "status": "shipped" }
 * }
 */
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