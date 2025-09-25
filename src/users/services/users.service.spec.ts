import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';

describe('UsersService', () => {
    let service: UsersService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [UsersService],
        }).compile();

        service = module.get<UsersService>(UsersService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should create a user', async () => {
        const user = await service.createUser({
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            password: 'password',
        });
        expect(user).toEqual({
            id: expect.any(String),
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            password: 'password',
        });
    });

    it('should update a user', async () => {
        const user = await service.createUser({
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            password: 'password',
        });

        const updatedUser = await service.updateUser(user.id, {
            firstName: 'Jane',
            lastName: 'Doe',
            email: 'jane.doe@example.com',
            password: 'password2',
        });

        expect(updatedUser).toEqual({
            id: user.id,
            firstName: 'Jane',
            lastName: 'Doe',
            email: 'jane.doe@example.com',
            password: 'password2',
        });
    });

    it('should fetch a user', async () => {
        const user = await service.createUser({
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            password: 'password',
        });

        const fetchedUser = await service.fetchUserWithId(user.id);
        expect(fetchedUser).toEqual(user);
    });

    it('should throw an error if the user is not found', async () => {
        await expect(
            service.updateUser('1', {
                firstName: 'Jane',
                lastName: 'Doe',
                email: 'jane.doe@example.com',
                password: 'password2',
            }),
        ).rejects.toThrow('User not found');
    });
});
