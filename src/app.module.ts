import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { EventsModule } from './events/events.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        AuthModule.forRootAsync({
            imports: [],
            inject: [ConfigService],
            useFactory: (config: ConfigService) => {
                return {
                    hmacAuth: {
                        apiKey: config.get<string>(
                            'ADMIN_API_KEY',
                            'SOME_API_KEY',
                        ),
                        secret: config.get<string>(
                            'ADMIN_API_SECRET',
                            'SOME_API_SECRET',
                        ),
                    },
                };
            },
        }),
        UsersModule,
        EventsModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
