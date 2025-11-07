import jwt from 'jsonwebtoken';
import User from '../../models/user.ts';
import type { Request, Response, NextFunction } from 'express';
import config from '../../config/config.ts';



const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Authentication required' });
    }

    console.log('token', token)
    console.log('secret', config.secretKey)

    try {
        const decodedToken = jwt.verify(token, config.secretKey) as { userId: string };
        const user = await User.findById(decodedToken.userId);
        console.log('user')
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // req.user = user;
        next();
    } catch (error) {
        console.log('auth error', error)
        res.status(401).json({ message: 'Invalid token' });
    }
};

export { authenticate };