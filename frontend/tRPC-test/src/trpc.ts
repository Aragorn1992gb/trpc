// tRPC client

import { createTRPCProxyClient, httpBatchLink, wsLink } from '@trpc/client';
import { createWSClient } from '@trpc/client/links/wsLink';
import superjson from 'superjson';
import type { AppRouter } from '../../../backend/src/trpc';

// Initialize WebSocket client
const wsClient = createWSClient({
  url: 'ws://localhost:3001',
});

export const trpc = createTRPCProxyClient<AppRouter>({
  transformer: superjson, // Use the same transformer as the backend
  links: [
    wsLink({
      client: wsClient,
    }),
    httpBatchLink({
      url: 'http://localhost:3000/trpc',
      // for CORS issues
      fetch(url, options) {
        return fetch(url, {
          ...options,
          credentials: 'include',
        });
      }
    }),
  ],
});
console.log("### trpc client:", trpc);

console.log(Object.keys(trpc)); // This might show available procedures


async function debugTRPC() {
  try {
    console.log("trpc object:", trpc);
    console.log("Object keys:", Object.keys(trpc));
    
    // Log properties
    for (const key in trpc) {
      console.log(`Key: ${key}, Type: ${typeof trpc[key as keyof typeof trpc]}`);
    }

    // Call the procedure
    const users = await trpc.userList.query();
    console.log("Users:", users);
  } catch (error) {
    console.error("Detailed Error:", error);
    if (error instanceof Error) {
      console.error("Error Name:", error.name);
      console.error("Error Message:", error.message);
      console.error("Error Stack:", error.stack);
    }
  }
}

debugTRPC();

async function testProcedures() {
  try {
    console.log("Available procedures:", Object.keys(trpc));
    const users = await trpc.userList.query();
    console.log("Users:", users);
    const addussers = await trpc.createUser.mutate({ name: "Alice" });
    console.log("Created User:", addussers);
  } catch (error) {
    console.error("Detailed Error:", error);
    // Error logs
    if (error instanceof Error) {
      console.error("Error Name:", error.name);
      console.error("Error Message:", error.message);
      console.error("Error Stack:", error.stack);
    }
  }
}

testProcedures();
/**
 * 
 * 
Adding the transformer configuration in your tRPC client allows you to specify how data is serialized and deserialized when sent between the frontend and backend. This is useful when your data needs to be transformed into a format that is compatible with both ends of the application.

What is a Transformer in tRPC?
A transformer in tRPC is responsible for:

Serialization: Converting data into a format suitable for transport over the network (e.g., converting complex data structures into JSON strings).
Deserialization: Converting the transported data back into its original format (e.g., parsing JSON strings into JavaScript objects).
By default, tRPC uses JSON.stringify and JSON.parse for these operations. However, adding the transformer explicitly ensures consistency or allows customization.

Why Use a Transformer?
Custom Data Formats:

If your application uses data formats other than JSON (e.g., protobuf, msgpack), you can define custom serialization/deserialization functions to handle those.
Enhanced Data Handling:

For example, libraries like superjson or zod may require transformers to handle special data types like Date, Map, or Set.
Consistency:

Explicitly defining a transformer ensures that both client and server use the same serialization logic, reducing potential bugs.
Extensibility:

If your data grows in complexity or you want to switch to an advanced library for data compression or type handling in the future, you can simply update the transformer.

Should You Keep This Configuration?
If your application uses only simple data types (numbers, strings, objects), you can remove the transformer because tRPC already uses JSON.stringify and JSON.parse by default.
However, if you plan to handle complex data (e.g., Date, BigInt, Set), you might want to replace this with a more robust transformer like superjson.
 * 
 * 
 * 
 */