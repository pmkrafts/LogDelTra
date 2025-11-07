import User from '../../models/user.ts';


// Create a new order
const getUserId = async (emailId: string) => {
    try {
        // 1. Use findOne() to search for a single document
        // 2. The first object is the query condition: { field: value }
        // 3. The second object is the projection: { fieldToInclude: 1, fieldToExclude: 0 }
        const userRecord = await User.findOne(
            { emailId },
            { _id: 1 } // ONLY include the _id field
        ).exec();

        if (userRecord) {
            // The result is a Mongoose document containing only the _id
            const userId = userRecord._id;
            console.log('User ID (ObjectId):', userId);
            console.log('User ID (String):', userId);
            return userId;
        } else {
            console.log('User not found.');
            return null;
        }
    } catch (error) {
        console.error('An error occurred during the query:', error);
        throw error;
    }
};

export { getUserId };

