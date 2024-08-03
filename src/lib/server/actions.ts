import "server-only"

import { SignUpSchema } from "@/types";
import {
	DEFAULT_SERVER_ERROR_MESSAGE,
	createSafeActionClient,
} from "next-safe-action";
import { z } from "zod";

export class ActionError extends Error {}

// const actionClient = createSafeActionClient();

export const actionClient = createSafeActionClient({
	// You can provide a custom logging function, otherwise the lib will use `console.error`
	// as the default logging system. If you want to disable server errors logging,
	// just pass an empty Promise.
	handleServerErrorLog: (e) => {
		console.error(
			"CUSTOM ERROR LOG FUNCTION, server error message:",
			e.message
		);
	},
	handleReturnedServerError: (e) => {
		// If the error is an instance of `ActionError`, unmask the message.
		if (e instanceof ActionError) {
			return e.message;
		}

		// Otherwise return default error message.
		return DEFAULT_SERVER_ERROR_MESSAGE;
	},
	// Here we define a metadata type to be used in `metadata` instance method.
	defineMetadataSchema() {
		return z.object({
			actionName: z.string(),
		});
	},
}).use(async ({ next, metadata, clientInput, bindArgsClientInputs, ctx }) => {
	// Here we use a logging middleware.
	const start = Date.now();

	// Here we await the next middleware.
	const result = await next({ ctx });

	const end = Date.now();

	const durationInMs = end - start;

	const logObject: Record<string, any> = { durationInMs };

	logObject.clientInput = clientInput;
	logObject.bindArgsClientInputs = bindArgsClientInputs;
	logObject.metadata = metadata;
	logObject.result = result;

	console.log("LOGGING FROM MIDDLEWARE:");
	console.dir(logObject, { depth: null });

	// And then return the result of the awaited next middleware.
	return result;
});

async function getSessionId() {
	return crypto.randomUUID();
}

export const authenticatedAction = actionClient
	// In this case, context is used for (fake) auth purposes.
	.use(async ({ next }) => {
		const userId = crypto.randomUUID();

		console.log("HELLO FROM FIRST AUTH ACTION MIDDLEWARE, USER ID:", userId);

		return next({
			ctx: {
				userId,
			},
		});
	})
	// Here we get `userId` from the previous context, and it's all type safe.
	.use(async ({ ctx, next }) => {
		// Emulate a slow server.
		await new Promise((res) =>
			setTimeout(res, Math.max(Math.random() * 2000, 500))
		);

		const sessionId = await getSessionId();

		console.log(
			"HELLO FROM SECOND AUTH ACTION MIDDLEWARE, SESSION ID:",
			sessionId
		);

		return next({
			ctx: {
				...ctx, // here we spread the previous context to extend it
				sessionId, // with session id
			},
		});
	});

// export const signupAction = async () => {
//   try {
//     // console.log({ formData: Object.fromEntries(ctx) })
    
//   } catch (error) {
//     return {
//       error: "Something went wrong!"
//     }
//   }
// }

export const loginUser = actionClient
  .schema(SignUpSchema)
  .action(async ({ parsedInput: { username, password } }) => {
    if (username === "johndoe" && password === "123456") {
      return {
        success: "Successfully logged in",
      };
    }

    return { failure: "Incorrect credentials" };
  });
  
export const signupUser = actionClient
  .schema(SignUpSchema)
  .action(async ({ parsedInput: { username, email, password } }) => {
    if (email === "me@mt0.dev" && password === "password") {
      return {
        success: "Successfully logged in",
      };
    }

    // Check if user exists
    // Save user to database
    // return response object

    // const passwordHash = await hash(password, {
    // 	// recommended minimum parameters
    // 	memoryCost: 19456,
    // 	timeCost: 2,
    // 	outputLen: 32,
    // 	parallelism: 1
    // });
    // const userId = generateIdFromEntropySize(10); // 16 characters long
  
    // TODO: check if username is already used
    // await db.table("user").insert({
    // 	id: userId,
    // 	username: username,
    // 	password_hash: passwordHash
    // });
 
    // const session = await lucia.createSession(userId, {});
    // const sessionCookie = lucia.createSessionCookie(session.id);
    // cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
    // return redirect("/");

    return { failure: "Incorrect credentials" };
  });

// export default async function(){
//   return {
//     signupUser
//   }
// }