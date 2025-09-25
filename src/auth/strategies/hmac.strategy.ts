import { Inject, Injectable, Req } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-custom';
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
        // TODO: Implement HMAC validation
        return { apiKey: '' };
    }
}
