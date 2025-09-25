import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../models/user.model';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userEntityRepository: Repository<UserEntity>,
    ) {}

    async fetchUserWithId(id: string) {
        return this.userEntityRepository.findOne({ where: { id } });
    }

    async createUser(user: {
        firstName: string;
        lastName: string;
        email: string;
        password: string;
    }) {
        return this.userEntityRepository.create(user).save();
    }

    async updateUser(
        id: string,
        data: {
            firstName?: string;
            lastName?: string;
            email?: string;
            password?: string;
        },
    ) {
        const userEntity = await this.fetchUserWithId(id);

        if (!userEntity) {
            throw new NotFoundException('User not found');
        }

        Object.assign(userEntity, data);

        return userEntity.save();
    }

    public async deleteAll(): Promise<void> {
        await this.userEntityRepository.clear();
    }
}
