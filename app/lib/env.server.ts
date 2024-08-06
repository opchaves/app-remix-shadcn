import { z } from "zod";

// Define the schema as an object with all of the env variables and their types
const envSchema = z.object({
	PORT: z.coerce.number().default(3000),
	SECRET: z.string().default("r4ndoM-s3cr3t"),
	HASH_SALT: z.coerce.number().default(11),
	ENV: z
		.union([
			z.literal("development"),
			z.literal("testing"),
			z.literal("production"),
		])
		.default("development"),
});

// Validate `process.env` against our schema and return the result
const env = envSchema.parse(process.env);

// Export the result so we can use it in the project
export default env;
