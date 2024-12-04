// TypeORM connection

import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { User } from './entities/User';
import { Notification } from './entities/Notification';

const __dirname = dirname(fileURLToPath(import.meta.url));

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'canary',
  database: 'trpctest',
  synchronize: false, // Set to true to create tables automatically
  logging: true,
  entities: [User, Notification], // Ensure User is included here

});

AppDataSource.initialize().then(() => {
    console.log('Database connection initialized successfully!');
  }).catch((err) => {
    console.error('Error during Data Source initialization:', err);
  });
  