import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
	{
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},
		name: {
			type: String,
			required: true,
		},
		role: {
			type: String,
			// principal = Super Admin, hod = Admin, instructor = Teacher
			// Legacy support: 'admin' mapped to 'hod', 'teacher' mapped to 'instructor'
			enum: ['principal', 'hod', 'instructor', 'admin', 'teacher', 'user'],
			default: 'instructor',
		},
		department: {
			type: String,
			// Can be a specific branch name OR 'Global' for Super Admin
			required: false,
			default: null
		},
		lastLogin: {
			type: Date,
			default: Date.now,
		},
		isVerified: {
			type: Boolean,
			default: false,
		},
		resetPasswordToken: String,
		resetPasswordExpiresAt: Date,
		resetPasswordOTP: String,
		resetPasswordOTPExpiresAt: Date,
		verificationToken: String,
		verificationTokenExpiresAt: Date,
	},
	{ timestamps: true }
);

export const User = mongoose.model("User", userSchema);
