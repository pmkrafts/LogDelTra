import jwt from 'jsonwebtoken';
import User, { type IUser } from '../../models/user.ts';
import config from '../../config/config.ts';
import type { Request, Response, NextFunction } from 'express';


// Register a new user
const register = async (req: Request, res: Response, next: NextFunction) => {
    const { emailId, password, role } = req.body;

    try {
        // Password will be hashed automatically by the pre-save hook in the User model
        const user = new User({ emailId, password, role });
        await user.save();
        res.json({ message: 'Registration successful' });
    } catch (error) {
        console.log('error from here')
        next(error);
    }
};

// Login with an existing user
const login = async (req: Request, res: Response, next: NextFunction) => {
    const { emailId, password } = req.body;

    try {
        const user: IUser | null = await User.findOne({ emailId });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const passwordMatch = await user.comparePassword(password);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Incorrect password' });
        }

        const token = jwt.sign({ userId: user._id }, config.secretKey, {
            expiresIn: '24 hour'
        });
        res.json({ token });
    } catch (error) {
        next(error);
    }
};


export { register, login };