import mongoose from "mongoose";

export const connectDB = async () => {
	try {
		// Use 127.0.0.1 instead of localhost to avoid IPv6 issues.
		const mongoUri =
			process.env.MONGO_URI ||
			process.env.MONGODB_URI ||
			"mongodb://127.0.0.1:27017/TMS";
		
		console.log("MongoDB: Connecting to:", mongoUri);
		
		const conn = await mongoose.connect(mongoUri, {
			serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
		});
		
		console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
	} catch (error) {
		console.error("❌ Error connecting to MongoDB:", error.message);
		console.error("\n💡 Troubleshooting:");
		console.error("1. Make sure MongoDB service is running");
		console.error("2. If using Docker, run 'docker compose up -d mongodb' from the project root");
		console.error("3. Check that your MONGO_URI or MONGODB_URI matches the running MongoDB instance");
		console.error("4. Check if MongoDB is installed or the container is running");
		process.exit(1); // 1 is failure, 0 status code is success
	}
};
