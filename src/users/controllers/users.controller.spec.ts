import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from '../services/users.service';
import { ConfigModule } from '@nestjs/config';
import { WingmaiteTypeormModule } from '../../common/typeorm.module';
import ormconfig from '../../ormconfig';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../models/user.model';

describe('UsersController', () => {
    let controller: UsersController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot(),
                WingmaiteTypeormModule.forRoot(ormconfig),
                TypeOrmModule.forFeature([UserEntity]),
            ],
            controllers: [UsersController],
            providers: [UsersService],
        }).compile();

        controller = module.get<UsersController>(UsersController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
