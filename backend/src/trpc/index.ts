import { z } from 'zod';
import { AppDataSource } from '../data-source';
import { publicProcedure, router } from './trpc';
import { User } from '../entities/User';
import { Notification } from '../entities/Notification';
import { observable } from '@trpc/server/observable'; // Import observable for subscriptions

// Store active subscribers
const subscribers2 = new Set<(data: { id?: number; message: string, timestamp: string }) => void>();
 
export const appRouter = router({
  userList: publicProcedure
    .query(async () => {
        const userRepo = AppDataSource.getRepository(User);
        const users = await userRepo.find();
             
    return users.map(user => ({
        id: user.id,
        name: user.name
      }));

     }),
  createUser: publicProcedure
     .input(z.object({ name: z.string() }))
     .mutation(async ({ input }) => {
        const userRepo = AppDataSource.getRepository(User);
        const user = userRepo.create({ name: input.name });
        const user_added = await userRepo.save(user);

        return ({
            id: user_added.id,
            name: user_added.name
          });
     }),

   // Subscription to real-time notifications
    notifications: publicProcedure
      .subscription(() => {
        return observable<{ id?: number; message: string; timestamp: string  }>((emit) => {
          // Add subscriber to the list
          const send = (data: { id?: number; message: string; timestamp: string  }) => emit.next(data);
          subscribers2.add(send);

          // Cleanup when unsubscribing
          return () => {
            subscribers2.delete(send);
          };
        });
      }),

    // Mutation to trigger a notification
    sendNotification: publicProcedure
        .input(z.object({ message: z.string() })) // Define input schema
        .mutation(async ({ input }) => {
            const notification = { message: input.message, timestamp: new Date().toLocaleString() };
            const notificationRepo = AppDataSource.getRepository(Notification);
            const notificationSql = notificationRepo.create( notification );
            const savedNotification = await notificationRepo.save(notificationSql);

            subscribers2.forEach((send) => send({
                message: savedNotification.message,
                timestamp: savedNotification.timestamp.toString()
            }));

            return { success: true };
    }),

    // Query to rerieve all notifications
    getNotifications: publicProcedure
    .query(async () => {
        const notificationRepo = AppDataSource.getRepository(Notification);
        
        const notifications = await notificationRepo.find(); // Sort by newest first

        console.log("find", notifications)

        return notifications.map(notification => ({
            id: notification.id,
            message: notification.message,
            timestamp: notification.timestamp
            }));

        }),
});

export type AppRouter = typeof appRouter;