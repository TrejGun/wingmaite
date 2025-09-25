import { Test, TestingModule } from '@nestjs/testing';
import { HmacStrategy } from './hmac.strategy';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { createHmac } from 'crypto';
import { sub } from 'date-fns';

describe('HmacStrategy', () => {
    let strategy: HmacStrategy;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                HmacStrategy,
                {
                    provide: 'AUTH_OPTIONS',
                    useValue: {
                        hmacAuth: {
                            apiKey: 'api-key',
                            secret: 'secret',
                        },
                    },
                },
            ],
        }).compile();

        strategy = module.get<HmacStrategy>(HmacStrategy);
    });

    describe('validate', () => {
        const mockRequest = {
            method: 'POST',
            headers: {
                'x-access-key-id': 'api-key',
                'x-signature-version': '1',
                'x-timestamp': new Date().toISOString(),
                'x-signature': 'SOME_SIGNATURE',
                host: 'test.com',
            },
            protocol: 'https',
            originalUrl: '/test',
            body: { test: 'data' },
            get: jest.fn().mockReturnValue('test.com'),
        };

        beforeEach(() => {});

        afterEach(() => {});

        it('should throw BadRequestException when required headers are missing', async () => {
            const invalidRequest = {
                ...mockRequest,
                headers: {
                    'x-access-key-id': 'api-key',
                },
            };

            await expect(
                strategy.validate(invalidRequest as any),
            ).rejects.toThrow(BadRequestException);
        });

        it('should throw UnauthorizedException when timestamp is expired', async () => {
            const expiredRequest = {
                ...mockRequest,
                headers: {
                    ...mockRequest.headers,
                    'x-timestamp': sub(new Date(), {
                        minutes: 2,
                    }).toISOString(),
                },
            };

            await expect(
                strategy.validate(expiredRequest as any),
            ).rejects.toThrow(UnauthorizedException);
        });

        it('should throw UnauthorizedException when access key is invalid', async () => {
            const invalidKeyRequest = {
                ...mockRequest,
                headers: {
                    ...mockRequest.headers,
                    'x-access-key-id': 'invalid-key',
                },
            };

            await expect(
                strategy.validate(invalidKeyRequest as any),
            ).rejects.toThrow(UnauthorizedException);
        });

        it('should successfully validate a request with correct signature', async () => {
            const timestamp = new Date().toISOString();
            const stringToSign = `post\ntest.com\n${timestamp}\n/test\n{"test":"data"}`;
            const signature = createHmac('sha256', 'secret')
                .update(stringToSign)
                .digest('base64');

            const validRequest = {
                ...mockRequest,
                headers: {
                    ...mockRequest.headers,
                    'x-timestamp': timestamp,
                    'x-signature': signature,
                },
            };

            const result = await strategy.validate(validRequest as any);
            expect(result).toEqual({ apiKey: 'api-key' });
        });

        it('should successfully validate a request with undefined body', async () => {
            const timestamp = new Date().toISOString();
            const stringToSign = `post\ntest.com\n${timestamp}\n/test`;
            const signature = createHmac('sha256', 'secret')
                .update(stringToSign)
                .digest('base64');

            const validRequest = {
                ...mockRequest,
                body: undefined,
                headers: {
                    ...mockRequest.headers,
                    'x-timestamp': timestamp,
                    'x-signature': signature,
                },
            };

            const result = await strategy.validate(validRequest as any);
            expect(result).toEqual({ apiKey: 'api-key' });
        });

        it('should handle requests with query parameters correctly', async () => {
            const timestamp = new Date().toISOString();
            const requestWithQuery = {
                ...mockRequest,
                originalUrl: '/test?b=2&a=1',
                body: {},
            };

            const stringToSign = `post\ntest.com\n${timestamp}\n/test\na=1\n&b=2`;
            const signature = createHmac('sha256', 'secret')
                .update(stringToSign)
                .digest('base64');

            const validRequest = {
                ...requestWithQuery,
                headers: {
                    ...mockRequest.headers,
                    'x-timestamp': timestamp,
                    'x-signature': signature,
                },
            };

            const result = await strategy.validate(validRequest as any);
            expect(result).toEqual({ apiKey: 'api-key' });
        });

        it('should throw UnauthorizedException when signature is invalid', async () => {
            const invalidSignatureRequest = {
                ...mockRequest,
                headers: {
                    ...mockRequest.headers,
                    'x-signature': 'invalid-signature',
                },
            };

            await expect(
                strategy.validate(invalidSignatureRequest as any),
            ).rejects.toThrow(UnauthorizedException);
        });
    });
});
