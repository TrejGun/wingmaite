import {
    BadRequestException,
    Inject,
    Injectable,
    Req,
    UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-custom';
import { createHmac } from 'crypto';
import type { Request } from 'express';
import type { AuthModuleOptions } from '../auth.module-options';

/**
 * X-Access-Key-Id: asdadasd
 * X-Signature-Version: 1
 * X-Signature: asdasdasd
 * X-Timestamp: 2023-01-30T15:07:22+00:00
 * 
 * StringToSign =   HTTPVerbLowercase + "\n" +
                    ValueOfHostHeaderInLowercase + "\n" +
                    ValueOfXTimestampHeader + "\n" +
                    HTTPRequestURI +
                    + "\n" + CanonicalizedQueryString (if exists)
                    + "\n" + request.body (if exists)
 */

@Injectable()
export class HmacStrategy extends PassportStrategy(Strategy, 'hmac') {
    constructor(
        @Inject('AUTH_OPTIONS')
        private readonly authOptions: AuthModuleOptions,
    ) {
        super();
    }

    async validate(@Req() req: Request): Promise<any> {
        const { apiKey, secret } = this.authOptions.hmacAuth;

        // Check required headers
        const accessKeyId = req.headers['x-access-key-id'] as string;
        const signatureVersion = req.headers['x-signature-version'] as string;
        const timestamp = req.headers['x-timestamp'] as string;
        const signature = req.headers['x-signature'] as string;

        if (!accessKeyId || !signatureVersion || !timestamp || !signature) {
            throw new BadRequestException('Missing required headers');
        }

        // Check if access key matches
        if (accessKeyId !== apiKey) {
            throw new UnauthorizedException('Invalid access key');
        }

        // Check timestamp (allow 1 minute tolerance)
        const requestTime = new Date(timestamp);
        const now = new Date();
        const timeDiff = Math.abs(now.getTime() - requestTime.getTime());
        const maxAge = 60 * 1000; // 1 minute in milliseconds

        if (timeDiff > maxAge) {
            throw new UnauthorizedException('Request timestamp expired');
        }

        // Build string to sign
        const method = req.method.toLowerCase();
        const host = req.get('host') || '';
        const uri = req.originalUrl.split('?')[0]; // Remove query parameters
        const queryString = req.originalUrl.includes('?')
            ? req.originalUrl.split('?')[1]
            : '';

        let stringToSign = `${method}\n${host.toLowerCase()}\n${timestamp}\n${uri}`;

        if (queryString) {
            // Sort query parameters alphabetically and format as expected
            const sortedParams = queryString.split('&').sort().join('\n&');
            stringToSign += `\n${sortedParams}`;
        }

        if (req.body && Object.keys(req.body).length > 0) {
            stringToSign += `\n${JSON.stringify(req.body)}`;
        }

        // Generate expected signature
        const expectedSignature = createHmac('sha256', secret)
            .update(stringToSign)
            .digest('base64');

        // Verify signature
        if (signature !== expectedSignature) {
            throw new UnauthorizedException('Invalid signature');
        }

        return { apiKey };
    }
}
