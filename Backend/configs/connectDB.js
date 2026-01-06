import mongoose from "mongoose"

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("DB connected");
    } catch (error) {
        console.error("DB connection failed:", error);
        process.exit(1);
    }
}
export default connectDB;