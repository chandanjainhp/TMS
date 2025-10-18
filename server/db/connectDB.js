import mongoose from "mongoose";

export const connectDB = async () => {
	try {
		// Use 127.0.0.1 instead of localhost to avoid IPv6 issues
		const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/TMS";
		
		console.log("MongoDB: Connecting to:", mongoUri);
		
		const conn = await mongoose.connect(mongoUri, {
			serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
		});
		
		console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
	} catch (error) {
		console.error("❌ Error connecting to MongoDB:", error.message);
		console.error("\n💡 Troubleshooting:");
		console.error("1. Make sure MongoDB service is running");
		console.error("2. Run 'net start MongoDB' as Administrator");
		console.error("3. Or run: start-mongodb.bat as Administrator");
		console.error("4. Check if MongoDB is installed");
		process.exit(1); // 1 is failure, 0 status code is success
	}
};
