import mongoose from "mongoose";
import bcrypt from 'bcrypt';
import type { CallbackWithoutResultAndOptionalError } from "mongoose";

// Define the interface for the User document
interface IUser extends mongoose.Document {
    emailId: string;
    password: string;
    role: 'admin' | 'agent' | 'customer' | 'store';
    locations?: Map<string, {
        coordinates: number[];
        addressNo?: number;
        zonalNo?: number;
    }>;
    comparePassword(password: string): Promise<boolean>;
}

/**
 * Mongoose schema for User model representing system users with location data
 * 
 * @description Defines the structure for users in the logistics/delivery system.
 * Supports multiple user roles and stores location information with coordinates and zonal numbers.
 * 
 * @param {string} emailId - Unique email identifier for the user (required, lowercase, trimmed)
 * @param {string} password - User's password for authentication (required)
 * @param {string} role - User's role in the system (required, enum: 'admin', 'agent', 'customer', 'store')
 * @param {Map<string, object>} locations - Map of location names to location objects (optional)
 * @param {number[]} locations.*.coordinates - Array of exactly 2 numbers representing [longitude, latitude]
 * @param {number} locations.*.addressNo - Address number identifier for the location (optional)
 * @param {number} locations.*.zonalNo - Zonal number identifier for the location (optional)
 * 
 * @example
 * ```typescript
 * {
 *   emailId: "john.doe@example.com",
 *   password: "securePassword123",
 *   role: "customer",
 *   locations: {
 *     "home": {
 *       coordinates: [74.0060, 40.7128],
 *       addressNo: 123,
 *       zonalNo: 5
 *     }
 *   }
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
        type: Map,
        of: {
            coordinates: {
                type: [Number],
                validate: {
                    validator: function (val: number[]) {
                        return val.length === 2;
                    },
                    message: 'Coordinates must be an array of exactly 2 numbers [longitude, latitude]'
                }
            },
            addressNo: {
                type: Number
            },
            zonalNo: {
                type: Number
            }
        }
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

const User = mongoose.model<IUser>("User", userSchema);

export default User;
export type { IUser };