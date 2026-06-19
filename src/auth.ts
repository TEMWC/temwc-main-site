import { betterAuth } from "better-auth";
import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { twoFactor } from "better-auth/plugins";
import { getDb } from "./db";
import { sendVerificationEmail, sendPasswordResetEmail } from "./lib/email";

export function createAuth(D1Database: D1Database) {
	const db = getDb(D1Database);
	
	return betterAuth({
		database: drizzleAdapter(db, {
			provider: "sqlite",
		}),
		emailAndPassword: {
			enabled: true,
			requireEmailVerification: true,
		},
		emailVerification: {
			sendVerificationEmail: async ({ user, url }) => {
				await sendVerificationEmail(user.email, url);
			},
			autoSignInAfterVerification: true,
		},
		passwordReset: {
			sendResetPassword: async ({ user, url }: { user: { email: string }, url: string }) => {
				await sendPasswordResetEmail(user.email, url);
			},
		},
		plugins: [
			twoFactor({
				otpOptions: {
					async sendOTP(data, otp) {
						console.log(`Sending OTP: ${otp}`);
						// await resend.emails.send({
						// 	from: "Acme <no-reply@demo.better-auth.com>",
						// 	to: data.user.email,
						// 	subject: "Your OTP",
						// 	html: `Your OTP is ${otp}`,
						// });
					},
				},
			}),
		],
		rateLimit: {
			enabled: true,
		},
	});
}