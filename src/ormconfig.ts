import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

import { ns } from './common/constants';
import { UserEntity } from './users/models/user.model';
import {
    CreateSchema1561991000001,
    InstallExtensionUUID1561991000003,
} from './migrations';
import { CreateUser1694684323777 } from './migrations/1694684323777-create-user';

// Check typeORM documentation for more information.
const config: PostgresConnectionOptions = {
    name: 'default',
    type: 'postgres',
    entities: [UserEntity],
    // We are using migrations, synchronize should public-api set to false.
    synchronize: false,
    // Run migrations automatically,
    // you can disable this if you prefer running migration manually.
    // migrationsRun: process.env.NODE_ENV !== "production",
    migrationsRun: true,
    migrationsTableName: ns,
    migrationsTransactionMode: 'each',
    namingStrategy: new SnakeNamingStrategy(),
    logging: process.env.NODE_ENV === 'development',
    // Allow both start:prod and start:dev to use migrations
    // __dirname is either dist or server folder, meaning either
    // the compiled js in prod or the ts in dev.
    migrations: [
        CreateSchema1561991000001,
        InstallExtensionUUID1561991000003,
        CreateUser1694684323777,
    ],
};

export default config;
