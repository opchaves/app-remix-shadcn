import { AppLoadContext } from "@remix-run/node";
import bcrypt from "bcryptjs";
import { and, eq } from "drizzle-orm";

import { password, user } from "@/db.server/schema";
import env from "./env.server";

type CreateParams = {
	displayName: string;
	email: string;
	fullName: string;
	password: string;
};

export async function createUser(
	{ DB }: AppLoadContext,
	{ displayName, email, fullName, password: unhashedPassword }: CreateParams,
) {
	try {
		const [createdUser] = await DB.insert(user)
			.values({ displayName, email, fullName })
			.returning({
				id: user.id,
				displayName: user.displayName,
				email: user.email,
				fullName: user.fullName,
			});

		if (!createdUser) return null;

		try {
			const [inserted] = await DB.insert(password)
				.values({
					userId: createdUser.id,
					password: await bcrypt.hash(unhashedPassword, env.HASH_SALT),
				})
				.returning({ userId: password.userId });

			if (inserted?.userId !== createdUser.id) {
				throw new Error("Failed to create user");
			}
		} catch (reason) {
			console.error(reason);
			try {
				await DB.delete(user).where(eq(user.id, createdUser.id));
			} catch (cause) {
				throw new Error(
					"Failed to rollback user creation after password creation failed",
					{ cause },
				);
			}

			return null;
		}

		return createdUser;
	} catch (reason) {
		if (
			reason &&
			reason instanceof Error &&
			reason.message.includes("UNIQUE")
		) {
			return null;
		}
		throw reason;
	}
}

export async function getUserById({ DB }: AppLoadContext, userId: string) {
	const aUser = await DB.query.user.findFirst({
		columns: { id: true, displayName: true, email: true, fullName: true },
		where: eq(user.id, userId),
	});
	return aUser;
}

type GetUserParams = {
	email: string;
	password: string;
};

export async function getUserByLogin(
	{ DB }: AppLoadContext,
	{ email, password: unhashedPassword }: GetUserParams,
) {
	const foundUser = await DB.query.user.findFirst({
		columns: { id: true, displayName: true, email: true, fullName: true },
		where: eq(user.email, email),
	});
	if (!foundUser) return;

	const foundPassword = await DB.query.password.findFirst({
		columns: { password: true },
		where: and(eq(password.userId, foundUser.id)),
	});
	if (!foundPassword) return;

	const passwordMatch = await bcrypt.compare(
		unhashedPassword,
		foundPassword.password,
	);
	if (!passwordMatch) return;

	return foundUser;
}

type UpdateParams = {
	displayName: string;
	fullName: string;
};

export async function updateUser(
	{ DB }: AppLoadContext,
	userId: string,
	{ displayName, fullName }: UpdateParams,
) {
	const [aUser] = await DB.update(user)
		.set({ displayName, fullName })
		.where(eq(user.id, userId))
		.returning({
			id: user.id,
			displayName: user.displayName,
			email: user.email,
			fullName: user.fullName,
		});

	return aUser;
}
