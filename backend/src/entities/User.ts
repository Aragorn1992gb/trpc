// TypeORM Entity

// enable experimentalDecorators and emitDecoratorMetadata in tsconfig.json for the decorators to work, and import reflect-metadata
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { SuperJSON } from 'superjson';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar' })
  name!: string;

  // Add custom serialization if needed
  toJSON() {
    return {
      id: this.id,
      name: this.name
    };
  }
}

// Register custom serialization with SuperJSON
SuperJSON.registerCustom<User, object>(
  {
    isApplicable: (v): v is User => v instanceof User,
    serialize: (v) => ({
      id: v.id,
      name: v.name
    }),
    deserialize: (v) => Object.assign(new User(), v)
  },
  'User'
);