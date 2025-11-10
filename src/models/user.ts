import mongoose from "mongoose";
import bcrypt from 'bcrypt';
import type { CallbackWithoutResultAndOptionalError } from "mongoose";

// Interface for the subdocument (the structure of each item in the locations array)
interface ILocation {
    _id: mongoose.Types.ObjectId; // Mongoose adds this automatically
    name: string;
    coordinates: number[];
    addressNo?: number;
    zonalNo?: number;
}


// Define the interface for the User document
interface IUser extends mongoose.Document {
    emailId: string;
    password: string;
    role: 'admin' | 'agent' | 'customer' | 'store';
    locations?: ILocation[];
    comparePassword(password: string): Promise<boolean>;
}


/**
 * Mongoose subschema for location information
 * 
 * @param {string} name - Unique name identifier for the location
 * @param {number[]} coordinates - Array of exactly 2 numbers [longitude, latitude]
 * @param {number} addressNo - Optional address number for the location
 * @param {number} zonalNo - Optional zonal number for the location
 * 
 * @example
 * {
 *   name: "office",
 *   coordinates: [-73.9857, 40.7484],
 *   addressNo: 350,
 *   zonalNo: 2
 * }
 */
const locationSubSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true, // Unique within the whole array
    },
    coordinates: {
        type: [Number],
        required: true,
        validate: {
            validator: (val: number[]) => val.length === 2,
            message: 'Coordinates must be an array of exactly 2 numbers [longitude, latitude]'
        }
    },
    addressNo: { type: Number },
    zonalNo: { type: Number }
});

/**
 * Mongoose schema for User model representing system users with location data
 * 
 * @description Defines the structure for users in the logistics/delivery system.
 * Supports multiple user roles and stores location information with coordinates and zonal numbers.
 * 
 * @param {string} emailId - Unique email identifier for the user (required, lowercase, trimmed)
 * @param {string} password - User's password for authentication (required)
 * @param {string} role - User's role in the system (required, enum: 'admin', 'agent', 'customer', 'store')
 * @param {Array} locations - Array of location objects (optional)
 * @param {string} locations[].name - Name of the location
 * @param {number[]} locations[].coordinates - Array of exactly 2 numbers representing [longitude, latitude]
 * @param {number} locations[].addressNo - Address number identifier for the location (optional)
 * @param {number} locations[].zonalNo - Zonal number identifier for the location (optional)
 * 
 * @example
 * ```typescript
 * {
 *   emailId: "john.doe@example.com",
 *   password: "securePassword123",
 *   role: "customer",
 *   locations: [{
 *     name: "home",
 *     coordinates: [74.0060, 40.7128],
 *     addressNo: 123,
 *     zonalNo: 5
 *   }]
 * }
 * ```
 * 
 * @timestamps Automatically adds createdAt and updatedAt fields
 */
const userSchema = new mongoose.Schema({
    emailId: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['admin', 'agent', 'customer', 'store'],
        required: true
    },
    locations: {
        type: [locationSubSchema], // Array of subdocuments
        default: []
    }
}, {
    timestamps: true
})

// Hash the password before saving it to the database
userSchema.pre('save', async function (this: any, next: CallbackWithoutResultAndOptionalError) {
    const user = this;
    if (!user.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt();
        user.password = await bcrypt.hash(user.password, salt);
        next();
    } catch (error: any) {
        return next(error);
    }
});

// Compare the given password with the hashed password in the database
userSchema.methods.comparePassword = async function (this: any, password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
};


// for locations
// 1. Add (Append) a new location
userSchema.statics.addLocation = async function (
    userId: string,
    newLocation: Omit<ILocation, '_id'>
): Promise<IUser | null> {
    return this.findByIdAndUpdate(
        userId,
        { $push: { locations: newLocation } }, // $push adds the item to the array
        { new: true, runValidators: true }
    ).exec();
};

// 2. Remove a location by name
userSchema.statics.removeLocation = async function (
    userId: string,
    locationName: string
): Promise<IUser | null> {
    return this.findByIdAndUpdate(
        userId,
        { $pull: { locations: { name: locationName } } }, // $pull removes the item matching the query
        { new: true }
    ).exec();
};

// 3. Update an existing location's fields by name
userSchema.statics.updateLocation = async function (
    userId: string,
    locationName: string,
    updates: Partial<ILocation>
): Promise<IUser | null> {
    // Use the positional $ operator to update the specific element in the array
    // The filter finds the user and the specific location array element
    const updateQuery: any = {};

    // Dynamically create $set operations for each field in updates
    for (const [key, value] of Object.entries(updates)) {
        updateQuery[`locations.$.${key}`] = value;
    }

    return this.findOneAndUpdate(
        { _id: userId, 'locations.name': locationName }, // Find the user AND the location
        { $set: updateQuery },
        { new: true, runValidators: true }
    ).exec();
};

// Define the User model with static methods
interface IUserModel extends mongoose.Model<IUser> {
    addLocation(userId: string, newLocation: Omit<ILocation, '_id'>): Promise<IUser | null>;
    removeLocation(userId: string, locationName: string): Promise<IUser | null>;
    updateLocation(userId: string, locationName: string, updates: Partial<ILocation>): Promise<IUser | null>;
}

const User = mongoose.model<IUser, IUserModel>("User", userSchema);

export default User;
export type { IUser, ILocation };