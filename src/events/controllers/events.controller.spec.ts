import { Test, TestingModule } from '@nestjs/testing';
import { EventsController } from './events.controller';

describe('EventsController', () => {
    let controller: EventsController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [EventsController],
        }).compile();

        controller = module.get<EventsController>(EventsController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('should collect and return all events', async () => {
        const events = await controller.getEvents();
        expect(events).toEqual([
            { id: 1, name: 'Event 1', description: 'Description 1' },
            { id: 2, name: 'Event 2', description: 'Description 2' },
            { id: 3, name: 'Event 3', description: 'Description 3' },
        ]);
    });
});
