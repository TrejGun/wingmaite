import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    Put,
    UseGuards,
} from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { HmacGuard } from '../../auth/guards/hmac.guard';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get(':id')
    @UseGuards(HmacGuard)
    async getUser(@Param('id') id: string) {
        return this.usersService.fetchUserWithId(id);
    }

    @Post()
    @UseGuards(HmacGuard)
    async createUser(
        @Body()
        body: {
            firstName: string;
            lastName: string;
            email: string;
            password: string;
        },
    ) {
        return this.usersService.createUser(body);
    }

    @Put(':id')
    @UseGuards(HmacGuard)
    async updateUser(
        @Param('id') id: string,
        @Body()
        body: {
            firstName?: string;
            lastName?: string;
            email?: string;
            password?: string;
        },
    ) {
        return this.usersService.updateUser(id, body);
    }
}
