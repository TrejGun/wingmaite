import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import request from 'supertest';

import { UsersModule } from '../src/users/users.module';
import { UserEntity } from '../src/users/models/user.model';
import { AuthModule } from '../src/auth/auth.module';
import { WingmaiteTypeormModule } from '../src/common/typeorm.module';
import { signRequest } from './utils';
import { TEST_API_KEY, TEST_HOST, TEST_SECRET } from './constants';
import ormconfig from '../src/ormconfig';

describe('UsersController (e2e with HMAC)', () => {
    let app: INestApplication;

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({ isGlobal: true }),
                AuthModule.forRootAsync({
                    imports: [],
                    inject: [],
                    useFactory: () => ({
                        hmacAuth: {
                            apiKey: TEST_API_KEY,
                            secret: TEST_SECRET,
                        },
                    }),
                }),
                WingmaiteTypeormModule.forRoot(ormconfig),
                TypeOrmModule.forFeature([UserEntity]),
                UsersModule,
            ],
        }).compile();

        app = moduleRef.createNestApplication();
        await app.init();
    });

    afterAll(async () => {
        if (app) {
            await app.close();
        }
    });

    it('POST /users should create a user (HMAC)', async () => {
        const body = {
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            password: 'secret123',
        };
        const headers = signRequest('POST', TEST_HOST, '/users', body);

        const res = await request(app.getHttpServer())
            .post('/users')
            .set(headers)
            .send(body)
            .expect(201);

        expect(res.body).toHaveProperty('id');
        expect(res.body.firstName).toBe('John');
        expect(res.body.lastName).toBe('Doe');
        expect(res.body.email).toBe('john.doe@example.com');
        expect(res.body.password).toBeUndefined();
    });

    it('GET /users/:id should return a user (HMAC)', async () => {
        // First create a user
        const createBody = {
            firstName: 'Alice',
            lastName: 'Smith',
            email: 'alice.smith@example.com',
            password: 'pass1234',
        };
        const createHeaders = signRequest(
            'POST',
            TEST_HOST,
            '/users',
            createBody,
        );
        const created = await request(app.getHttpServer())
            .post('/users')
            .set(createHeaders)
            .send(createBody)
            .expect(201);

        const id = created.body.id as string;
        const getHeaders = signRequest('GET', TEST_HOST, `/users/${id}`);

        const res = await request(app.getHttpServer())
            .get(`/users/${id}`)
            .set(getHeaders)
            .expect(200);

        expect(res.body.id).toBe(id);
        expect(res.body.email).toBe('alice.smith@example.com');
        expect(res.body.password).toBeUndefined();
    });

    it('PUT /users/:id should update a user (HMAC)', async () => {
        // Create a user first
        const createBody = {
            firstName: 'Bob',
            lastName: 'Brown',
            email: 'bob.brown@example.com',
            password: 'pwd',
        };
        const createHeaders = signRequest(
            'POST',
            TEST_HOST,
            '/users',
            createBody,
        );
        const created = await request(app.getHttpServer())
            .post('/users')
            .set(createHeaders)
            .send(createBody)
            .expect(201);

        const id = created.body.id as string;
        const updateBody = { firstName: 'Bobby' };
        const updateHeaders = signRequest(
            'PUT',
            TEST_HOST,
            `/users/${id}`,
            updateBody,
        );

        const res = await request(app.getHttpServer())
            .put(`/users/${id}`)
            .set(updateHeaders)
            .send(updateBody)
            .expect(200);

        expect(res.body.id).toBe(id);
        expect(res.body.firstName).toBe('Bobby');
        expect(res.body.password).toBeUndefined();
    });
});
