// // Express and tRPC middleware

import express from 'express';
import cors from 'cors';
import { createExpressMiddleware } from '@trpc/server/adapters/express';
// import { appRouter } from './trpc';  // Import the router from the trpc folder
import { appRouter } from './trpc';
import { AppDataSource } from './data-source.js';
import { applyWSSHandler } from '@trpc/server/adapters/ws';
import { WebSocketServer } from 'ws';

const app = express();

// CORS middleware
app.use(cors({
  origin: 'http://localhost:5173', // Replace with your frontend's URL
  credentials: true
}));


// Use the tRPC middleware on the '/trpc' route
app.use('/trpc', createExpressMiddleware({
  router: appRouter,  // Use the defined router
  createContext: () => ({}),  // No context for this basic example
}));


// Initialize WebSocket server
const wss = new WebSocketServer({ port: 3001 });
applyWSSHandler({
  wss,
  router: appRouter,
  createContext: () => ({}),
});

wss.on('connection', () => {
  console.log('WebSocket connection established');
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
  console.log('WebSocket server running on ws://localhost:3001');
  AppDataSource.initialize()
    .then(() => {
      console.log('Database connected');
    })
    .catch((error) => console.error('Error during Data Source initialization:', error));
});


// start with npx tsx src/index.ts