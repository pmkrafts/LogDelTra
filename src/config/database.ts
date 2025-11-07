import mongoose from "mongoose";
import config from "./config.ts";

const connectDB = async () => {
    // await mongoose.connect("mongodb+srv://adminadmin:newadmin@cluster0.lgkzx.mongodb.net/devTinderApp")
    await mongoose.connect(config.mongodbUri);
    // await mongoose.connect('mongodb+srv://admin:admin@cluster0.hqbd1ww.mongodb.net/', {
    //     // Pass the database name in the options object
    //     dbName: 'logdeltra',
    // })
};

export default connectDB;