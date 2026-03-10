import type { PostConfirmationTriggerHandler } from "aws-lambda";
import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/api";

// This is the official way to import environment variables in Amplify Gen 2
// @ts-ignore
import { env } from "$amplify/env/post-confirmation"; 

import { createTodo } from "./graphql/mutations";

Amplify.configure(
  {
    API: {
      GraphQL: {
        endpoint: env.AMPLIFY_DATA_GRAPHQL_ENDPOINT,
        region: env.AWS_REGION,
        defaultAuthMode: "iam",
      },
    },
  },
  {
    Auth: {
      credentialsProvider: {
        getCredentialsAndIdentityId: async () => ({
          credentials: {
            accessKeyId: env.AWS_ACCESS_KEY_ID,
            secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
            sessionToken: env.AWS_SESSION_TOKEN,
          },
        }),
        clearCredentialsAndIdentityId: () => { /* noop */ },
      },
    },
  }
);

const client = generateClient({ authMode: "iam" });

export const handler: PostConfirmationTriggerHandler = async (event) => {
  await client.graphql({
    query: createTodo,
    variables: {
      input: {
        content: `Welcome to the app, ${event.userName}!`,
      },
    },
  });

  return event;
};