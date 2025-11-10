
import User from '../../models/user.ts';

/**
 * Retrieves the locations associated with a user's email ID from the database
 * @param emailId - The email ID of the user to find locations for (e.g., "user@example.com")
 * @returns Promise that resolves to either:
 * - An array of location objects if the user is found
 * - null if no user is found with the given email
 * @throws Database query errors are logged and re-thrown
 * @example const locations = await getUserLocations("user@example.com");
 * // Returns: Locations or null
 */
const getUserLocations = async (emailId: string) => {
    try {
        const userRecord = await User.findOne(
            { emailId },
            { locations: 1 } // ONLY include the locations field
        ).exec();

        if (userRecord) {
            // The result is a Mongoose document containing only the locations
            const userLocations = userRecord.locations;
            return userLocations;
        } else {
            return null;
        }
    } catch (error) {
        console.error('An error occurred during the query:', error);
        throw error;
    }
};

export { getUserLocations };

