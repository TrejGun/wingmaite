import { Injectable } from '@nestjs/common';
import { User } from '../models/user.model';
import { randomUUID } from 'crypto';

@Injectable()
export class UsersService {
    private users: User[] = [];

    async fetchUserWithId(id: string) {
        return this.users.find((u) => u.id === id) ?? null;
    }

    async createUser(user: {
        firstName: string;
        lastName: string;
        email: string;
        password: string;
    }) {
        const newUser: User = {
            id: randomUUID(),
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            password: user.password,
        };
        this.users.push(newUser);
        return newUser;
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
        const index = this.users.findIndex((u) => u.id === id);
        if (index === -1) {
            throw new Error(`User not found`);
        }
        const user = this.users[index];
        this.users[index] = {
            ...user,
            ...data,
        };
        return this.users[index];
    }
}
