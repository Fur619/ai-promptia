import mongoose from "mongoose"

let isConnected = false;

export const connectToDB = async () => {
    mongoose.set("strictQuery", true);

    if (isConnected) {
        console.log("Mongo Db is Already Connected");
        return
    }

    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            dbName: "nextjs-ai-prompt"
        })
        isConnected = true;
        console.log("MongoDB connected");
    } catch (error) {
        console.log("MongoDB Error::", error);
        isConnected = false
    }
}