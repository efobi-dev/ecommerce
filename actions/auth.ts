"use server";

import {
	type SignIn,
	type SignUp,
	signInSchema,
	signUpSchema,
} from "@/lib/constants";
import prisma from "@/lib/db";
import {
	type SessionValidationResult,
	createSession,
	deleteSessionTokenCookie,
	generateSessionToken,
	invalidateSession,
	setSessionTokenCookie,
	validateSessionToken,
} from "@/lib/session";
import type { User } from "@prisma/client";
import { nanoid } from "nanoid";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { Argon2id } from "oslo/password";
import { cache } from "react";

export async function signUp(values: SignUp) {
	try {
		const { data, error } = await signUpSchema.safeParseAsync(values);
		if (error) return { error: "Invalid body received" };
		const { email, password, fullName, role } = data;
		const [hashedPassword, userId] = await Promise.all([
			new Argon2id().hash(password),
			Promise.resolve(nanoid(10)),
		]);

		await prisma.$transaction(async (tx) => {
			await tx.user.create({
				data: {
					id: userId,
					email,
					hashedPassword,
					role,
					fullName,
				},
			});

			await tx.customer.upsert({
				where: { userId },
				update: {
					name: fullName,
					email,
				},
				create: {
					userId,
					name: fullName,
					email,
					phone: "",
					address: "",
				},
			});
		});

		const token = generateSessionToken();
		const session = await createSession(token, userId);
		setSessionTokenCookie(token, session.expiresAt);
		return { success: true, redirectTo: "/products" };
	} catch (error) {
		console.error(error);
		return { error: "Internal server error" };
	}
}

export async function signIn(values: SignIn) {
	try {
		const { data, error } = await signInSchema.safeParseAsync(values);
		if (error) return { error: "Invalid body received" };
		const { email, password } = data;
		const user = await prisma.user.findUnique({
			where: { email },
			select: {
				id: true,
				hashedPassword: true,
			},
		});
		if (!user) return { error: "Incorrect email or password" };
		const validPassword = await new Argon2id().verify(
			user.hashedPassword,
			password,
		);
		if (!validPassword) return { error: "Incorrect email or password" };
		const token = generateSessionToken();
		const session = await createSession(token, user.id);
		setSessionTokenCookie(token, session.expiresAt);
		return { success: true, redirectTo: "/products" };
	} catch (error) {
		console.error(error);
		return { error: "Internal server error" };
	}
}

export const getAuth = cache(async (): Promise<SessionValidationResult> => {
	const sessionCookie = (await cookies()).get("session");
	if (!sessionCookie?.value) {
		return { session: null, user: null };
	}
	return await validateSessionToken(sessionCookie.value);
});

export async function signOut() {
	const { session } = await getAuth();
	if (!session) {
		return { success: true, redirectTo: "/login" };
	}
	try {
		await invalidateSession(session.id);
		deleteSessionTokenCookie();
		return { success: true, redirectTo: "/login" };
	} catch (error) {
		console.error(error);
		return { error: "Internal server error" };
	}
}

export async function changePassword(email: string, password: string) {
	try {
		const { user } = await getAuth();
		if (!user) return { error: "Not authenticated" };
		if (user.email !== email)
			return { error: "Email does not match logged in user" };

		const hashedPassword = await new Argon2id().hash(password);
		const response = await prisma.user.update({
			where: { email },
			data: { hashedPassword },
			select: { id: true },
		});

		if (!response) return { error: "Failed to update password" };
		return { success: true, message: "Password updated successfully" };
	} catch (error) {
		console.error(error);
		return { error: "Internal server error" };
	}
}

export async function changeEmail(email: string) {
	try {
		const { user } = await getAuth();
		if (!user) return { error: "Not authenticated" };

		const response = await prisma.user.update({
			where: { id: user.id },
			data: { email },
			select: { id: true },
		});

		if (!response) return { error: "Failed to update email" };
		return { success: true, message: "Email updated successfully" };
	} catch (error) {
		console.error(error);
		return { error: "Internal server error" };
	}
}

export async function changeName(name: string) {
	try {
		const { user } = await getAuth();
		if (!user) return { error: "Not authenticated" };

		const response = await prisma.user.update({
			where: { id: user.id },
			data: { fullName: name },
			select: { id: true },
		});

		if (!response) return { error: "Failed to update name" };
		return { success: true, message: "Name updated successfully" };
	} catch (error) {
		console.error(error);
		return { error: "Internal server error" };
	}
}

export async function createAdmin(values: SignUp) {
	try {
		const { user } = await getAuth();
		if (user?.role !== "Superadmin") return { error: "Unauthorized" };

		const { data, error } = await signUpSchema.safeParseAsync(values);
		if (error) return { error: "Invalid credentials" };

		const { email, password, role, fullName } = data;
		const [hashedPassword, userId] = await Promise.all([
			new Argon2id().hash(password),
			Promise.resolve(nanoid(10)),
		]);

		const response = await prisma.user.create({
			data: {
				id: userId,
				email,
				hashedPassword,
				role,
				fullName,
			},
			select: { id: true },
		});

		if (!response) return { error: "User creation failed" };
		return { success: true, message: "User created successfully" };
	} catch (error) {
		console.error(error);
		return { error: "Something went wrong" };
	}
}

export async function updateAdmin(
	values: Omit<User, "hashedPassword">,
): Promise<{ error: string } | { success: boolean; message: string }> {
	try {
		const { user } = await getAuth();
		if (user?.role !== "Superadmin") return { error: "Unauthorized operation" };

		const response = await prisma.user.update({
			where: { id: values.id },
			data: values,
			select: { id: true },
		});

		if (!response) return { error: "User update failed" };
		revalidatePath("/settings");
		return { success: true, message: "User updated successfully" };
	} catch (error) {
		console.error(error);
		return { error: "Something went wrong" };
	}
}

export async function deleteAdmin(id: string) {
	try {
		const { user } = await getAuth();
		if (user?.role !== "Superadmin") return { error: "Unauthorized operation" };

		const response = await prisma.user.delete({
			where: { id },
			select: { id: true },
		});

		if (!response) return { error: "User delete failed" };
		revalidatePath("/settings");
		return { success: true, message: "User deleted successfully" };
	} catch (error) {
		console.error(error);
		return { error: "Something went wrong" };
	}
}
