import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from '../services/users.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WingmaiteTypeormModule } from '../../common/typeorm.module';
import { UserEntity } from '../models/user.model';
import ormconfig from '../../ormconfig';

describe('UsersController', () => {
    let controller: UsersController;
    let service: UsersService;

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
        service = module.get<UsersService>(UsersService);
    });

    afterEach(async () => {
        await service.deleteAll();
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('should create a user via controller', async () => {
        const created = await controller.createUser({
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            password: 'password',
        });

        expect(created).toEqual({
            id: expect.any(String),
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            password: 'password',
        });
    });

    it('should fetch a user via controller', async () => {
        const created = await controller.createUser({
            firstName: 'Alice',
            lastName: 'Smith',
            email: 'alice@example.com',
            password: 'pwd',
        });

        const fetched = await controller.getUser(created.id);
        expect(fetched).toEqual(created);
    });

    it('should update a user via controller', async () => {
        const created = await controller.createUser({
            firstName: 'Bob',
            lastName: 'Brown',
            email: 'bob@example.com',
            password: 'pwd1',
        });

        const updated = await controller.updateUser(created.id, {
            firstName: 'Bobby',
            lastName: 'Brown',
            email: 'bob@example.com',
            password: 'pwd2',
        });

        expect(updated).toEqual({
            id: created.id,
            firstName: 'Bobby',
            lastName: 'Brown',
            email: 'bob@example.com',
            password: 'pwd2',
        });
    });

    it('should throw if updating non-existing user via controller', async () => {
        await expect(
            controller.updateUser('00000000-0000-0000-0000-000000000000', {
                firstName: 'Ghost',
            }),
        ).rejects.toThrow('User not found');
    });
});
