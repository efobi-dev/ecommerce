import { adminClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

const authClient = createAuthClient({
	plugins: [adminClient()],
});

export const {
	signIn,
	signOut,
	getSession,
	signUp,
	admin,
	changeEmail,
	updateUser,
	changePassword,
} = authClient;
