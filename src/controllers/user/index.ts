import type { Request, Response, NextFunction } from 'express';
import User, { type IUser, type ILocation } from '../../models/user.ts';


/**
 * Updates user's locations by adding a new location to their profile
 * 
 * @param req - Express Request object containing:
 *   - emailId: User's email identifier
 *   - name: Name of the location
 *   - coordinates: Array of [latitude, longitude]
 *   - addressNo: (Optional) Address number
 *   - zonalNo: (Optional) Zonal number
 * @param res - Express Response object
 * @param next - Express NextFunction for error handling
 * 
 * @returns Promise resolving to:
 *   - 200: JSON with success message and updated user
 *   - 404: JSON with error if user not found
 *   - 400: JSON with error if location addition fails
 * 
 * @throws Forwards any errors to next() middleware
 * 
 * @example
 * ```json
 * {
 *   "emailId": "pm1@gmail.com",
 *   "name": "Home",
 *   "coordinates": [12.9716, 77.5946],
 *   "addressNo": "123",
 *   "zonalNo": "4"
 * }
 * ```
 */
const addUserLocation = async (req: Request, res: Response, next: NextFunction) => {
    const { emailId, name, coordinates, addressNo, zonalNo } = req.body;

    try {
        const user: IUser | null = await User.findOne({ emailId });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const newLocation: Omit<ILocation, '_id'> = {
            name,
            coordinates,
            ...(addressNo && { addressNo }),
            ...(zonalNo && { zonalNo })
        };

        const updatedUser = await User.addLocation(String(user._id), newLocation);

        if (!updatedUser) {
            return res.status(400).json({ message: 'Failed to add location' });
        }

        res.json({ message: 'Location added successfully', user: updatedUser });
    } catch (error) {
        console.log('error from here', error);
        next(error);
    }
};

export { addUserLocation };