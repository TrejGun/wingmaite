import { DynamicModule, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { HmacStrategy } from './strategies/hmac.strategy';
import { AuthModuleOptions } from './auth.module-options';

@Module({})
export class AuthModule {
    static forRootAsync(options: {
        imports?: any[];
        inject?: any[];
        useFactory: (...args: any[]) => AuthModuleOptions;
    }): DynamicModule {
        return {
            module: AuthModule,
            global: true,
            imports: [
                PassportModule.register({ defaultStrategy: 'hmac' }),
                ...(options.imports || []),
            ],
            providers: [
                {
                    provide: 'AUTH_OPTIONS',
                    useFactory: options.useFactory,
                    inject: options.inject || [],
                },
                HmacStrategy,
            ],
            exports: [PassportModule],
        };
    }
}
