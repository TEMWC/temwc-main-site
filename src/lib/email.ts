import { Resend } from 'resend';

const resend = new Resend(import.meta.env.RESEND_API_KEY || 're_Z3nptS5K_BcpJQ2y2G6Bz4VXvGsENTzMc');

export async function sendVerificationEmail(to: string, url: string) {
	try {
		await resend.emails.send({
			from: 'onboarding@resend.dev',
			to: to,
			subject: 'Verify your email address',
			html: `
				<p>Please verify your email address by clicking the link below:</p>
				<p><a href="${url}">${url}</a></p>
				<p>If you didn't request this verification, you can safely ignore this email.</p>
			`
		});
		return { success: true };
	} catch (error) {
		console.error('Failed to send verification email:', error);
		return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
	}
}

export async function sendPasswordResetEmail(to: string, url: string) {
	try {
		await resend.emails.send({
			from: 'onboarding@resend.dev',
			to: to,
			subject: 'Reset your password',
			html: `
				<p>You requested a password reset. Click the link below to reset your password:</p>
				<p><a href="${url}">${url}</a></p>
				<p>If you didn't request this password reset, you can safely ignore this email.</p>
			`
		});
		return { success: true };
	} catch (error) {
		console.error('Failed to send password reset email:', error);
		return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
	}
}
