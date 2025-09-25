import { Controller, Get, UseGuards } from '@nestjs/common';
import { concatMap, delay, from, lastValueFrom, of } from 'rxjs';
import { HmacGuard } from '../../auth/guards/hmac.guard';

@Controller('events')
export class EventsController {
    private readonly events = from([
        {
            id: 1,
            name: 'Event 1',
            description: 'Description 1',
        },
        {
            id: 2,
            name: 'Event 2',
            description: 'Description 2',
        },
        {
            id: 3,
            name: 'Event 3',
            description: 'Description 3',
        },
    ]).pipe(
        concatMap((item) =>
            of(item).pipe(
                delay(100), // 100ms delay between emissions
            ),
        ),
    );

    @Get()
    @UseGuards(HmacGuard)
    getEvents() {
        return lastValueFrom(
            this.events
                .pipe
                // TODO: Implement logic to collect all events
                // and return them as a single array
                (),
        );
    }
}
