// TypeORM Entity

import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { SuperJSON } from 'superjson';

@Entity()
export class Notification {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar' })
  message!: string;

  @Column({ type: 'date' })
  timestamp!: Date;

  // Custom serialization
  toJSON() {
    return {
      id: this.id,
      message: this.message,
      timestamp: this.timestamp
    };
  }
}

// Register custom serialization with SuperJSON
SuperJSON.registerCustom<Notification, object>(
  {
    isApplicable: (v): v is Notification => v instanceof Notification,
    serialize: (v) => ({
      id: v.id,
      message: v.message,
      timestamp: v.timestamp
    }),
    deserialize: (v) => Object.assign(new Notification(), v)
  },
  'Notification'
);