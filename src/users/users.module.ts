import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UsersService } from './services/users.service';
import { UsersController } from './controllers/users.controller';
import { UserEntity } from './models/user.model';

@Module({
    imports: [ConfigModule, TypeOrmModule.forFeature([UserEntity])],
    providers: [UsersService],
    exports: [UsersService],
    controllers: [UsersController],
})
export class UsersModule {}
