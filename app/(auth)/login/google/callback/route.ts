import type { GoogleUser } from "@/lib/constants";
import prisma from "@/lib/db";
import {
	createSession,
	generateSessionToken,
	setSessionTokenCookie,
} from "@/lib/session";
import { google } from "@/lib/session";
import { cookies } from "next/headers";

export async function GET(request: Request): Promise<Response> {
	const url = new URL(request.url);
	const code = url.searchParams.get("code");
	const state = url.searchParams.get("state");
	const storedState =
		(await cookies()).get("google_oauth_state")?.value ?? null;
	const codeVerifier =
		(await cookies()).get("google_code_verifier")?.value ?? null;
	if (
		!code ||
		!state ||
		!storedState ||
		!codeVerifier ||
		state !== storedState
	) {
		return new Response(null, {
			status: 400,
		});
	}

	try {
		const tokens = await google.validateAuthorizationCode(code, codeVerifier);
		const response = await fetch(
			"https://openidconnect.googleapis.com/v1/userinfo",
			{
				headers: {
					Authorization: `Bearer ${tokens.accessToken}`,
				},
			},
		);
		const googleUser: GoogleUser = await response.json();
		const { given_name, family_name, sub, email, picture } = googleUser;
		const existingUser = await prisma.user.findUnique({
			where: { googleId: sub },
		});
		if (existingUser) {
			const sessionToken = generateSessionToken();
			const session = await createSession(sessionToken, existingUser.id);
			setSessionTokenCookie(sessionToken, session.expiresAt);
			return new Response(null, {
				status: 302,
				headers: {
					Location: "/",
				},
			});
		}
		const user = await prisma.user.create({
			data: {
				fullName: `${given_name} ${family_name}`,
				googleId: sub,
				email,
				avatar: picture,
				role: "User",
			},
		});
		const sessionToken = generateSessionToken();
		const session = await createSession(sessionToken, user.id);
		setSessionTokenCookie(sessionToken, session.expiresAt);
		return new Response(null, {
			status: 302,
			headers: {
				Location: "/",
			},
		});
	} catch (error) {
		console.error(error);
		return new Response(null, {
			status: 500,
		});
	}
}
