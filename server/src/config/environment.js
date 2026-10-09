import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const currentDirectory = path.dirname(fileURLToPath(import.meta.url));

dotenv.config({ path: path.resolve(currentDirectory, "../../../.env") });

const requiredVariables = ["MONGODB_URI", "JWT_SECRET"];
const missingVariables = requiredVariables.filter((name) => !process.env[name]);

if (missingVariables.length > 0) {
	throw new Error(`Missing required environment variables: ${missingVariables.join(", ")}`);
}

export const environment = {
	clientOrigin: process.env.CLIENT_ORIGIN || "http://localhost:3000",
	nodeEnv: process.env.NODE_ENV || "development",
	port: Number(process.env.PORT) || 5000,
};
