import mongoose from "mongoose";

/**
 * Mongoose schema definition for Order documents in the database.
 * 
 * @description Defines the structure and validation rules for order records,
 * including customer information, ordered items, delivery agent, and location coordinates
 * for both pickup and drop-off points.
 * 
 * @property {ObjectId} customerId - Reference to the User model representing the customer who placed the order
 * @property {Array<Object>} items - Array of ordered items with name, quantity, and price
 * @property {string} [agent] - Optional delivery agent identifier or name
 * @property {number} dropLong - Longitude coordinate for the delivery drop-off location
 * @property {number} dropLat - Latitude coordinate for the delivery drop-off location
 * @property {number} storeLong - Longitude coordinate for the store/pickup location
 * @property {number} storeLat - Latitude coordinate for the store/pickup location
 * @property {Date} createdAt - Automatically generated timestamp when the order was created
 * @property {Date} updatedAt - Automatically generated timestamp when the order was last modified
 * 
 * @since 1.0.0
 */
const orderSchema = new mongoose.Schema({
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    items: [{
        name: {
            type: String,
            required: true
        },
        quantity: {
            type: Number,
            required: true
        },
        price: {
            type: Number,
            required: true
        }
    }],
    // customer location where to drop the delivery
    dropAddressNo: {
        type: Number,
        required: true
    },
    // dropAddressNo: {
    //     coordinates: {
    //         type: [Number],
    //         required: true
    //     },
    //     addressNo: {
    //         type: Number,
    //         required: true
    //     },
    //     zonalNo: {
    //         type: Number,
    //         required: true
    //     }
    // },
    agentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Agent",
    },
    storeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Store",
    },
    // store location for pickup of the delivery
    storeAddressNo: {
        type: Number
    },
    status: {
        type: String,
        enum: ["queued", "processing", "fulfilled"],
        default: "queued"
    }
}, {
    timestamps: true
})

const Order = mongoose.model("Order", orderSchema);

export default Order;