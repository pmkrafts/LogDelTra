import jwt from 'jsonwebtoken';
import User, { type IUser } from '../../models/user.ts';
import config from '../../config/config.ts';
import type { Request, Response, NextFunction } from 'express';


// Register an user
/**
 * Registers a new user in the system
 * @param req.body.emailId - User's email address (e.g., "user@example.com")
 * @param req.body.password - User's password (e.g., "myPassword123")
 * @param req.body.role - User's role (e.g., "user" or "admin")
 * @param res - Express Response object
 * @param next - Express NextFunction for error handling
 * @returns JSON response with success message
 * @throws Forwards any errors to next() middleware
 * @example
 * POST /auth/register
 * {
 *   "emailId": "user@example.com",
 *   "password": "myPassword123",
 *   "role": "user"
 * }
 * 
 * // Success Response (200):
 * {
 *   "message": "Registration successful"
 * }
 */
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
/**
 * Authenticates a user and generates a JWT token
 * @param req.body.emailId - User's email address (e.g., "user@example.com")
 * @param req.body.password - User's password (e.g., "myPassword123")
 * @param res - Express Response object
 * @param next - Express NextFunction for error handling
 * @returns JSON response with JWT token
 * @throws Forwards any errors to next() middleware
 * @example
 * POST /auth/login
 * {
 *   "emailId": "user@example.com",
 *   "password": "myPassword123"
 * }
 * 
 * // Success Response (200):
 * {
 *   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 * }
 * 
 * // User Not Found Response (404):
 * {
 *   "message": "User not found"
 * }
 * 
 * // Invalid Password Response (401):
 * {
 *   "message": "Incorrect password"
 * }
 */
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