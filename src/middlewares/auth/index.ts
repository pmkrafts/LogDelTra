import jwt from 'jsonwebtoken';
import User from '../../models/user.ts';
import type { Request, Response, NextFunction } from 'express';
import config from '../../config/config.ts';


/**
 * Middleware function to authenticate requests using JWT tokens.
 * Verifies the token from the Authorization header and checks if the user exists in the database.
 * 
 * @param req - Express request object containing the authorization header with JWT token
 * @param res - Express response object used to send authentication status
 * @param next - Express next function to pass control to the next middleware
 * 
 * @example
 * // Usage in route definition
 * router.get('/protected-route', authenticate, (req, res) => {
 *   // Protected route logic
 * });
 * 
 * @example
 * // Example of valid authorization header
 * // Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 * 
 * @throws {401} If no token is provided or token is invalid
 * @throws {404} If user associated with token is not found
 * 
 * @returns {void} Calls next() if authentication is successful, otherwise sends error response
 */
const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Authentication required' });
    }

    // console.log('token', token)
    // console.log('secret', config.secretKey)

    try {
        const decodedToken = jwt.verify(token, config.secretKey) as { userId: string };
        const user = await User.findById(decodedToken.userId);
        // console.log('user')
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // req.user = user;
        next();
    } catch (error) {
        // console.log('auth error', error)
        res.status(401).json({ message: 'Invalid token' });
    }
};

export { authenticate };