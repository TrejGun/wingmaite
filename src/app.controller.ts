import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { HmacGuard } from './auth/guards/hmac.guard';

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}

    @Get('hmac-endpoint')
    @UseGuards(HmacGuard)
    getHello(): string {
        return this.appService.getHello();
    }
}
