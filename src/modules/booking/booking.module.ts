import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import { Booking } from './entity/booking.entity';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { IBookingRepository, BOOKING_REPOSITORY } from './repositories/booking.repository.interface';
import { BookingRepository } from './repositories/booking.repository';
import { UserModule } from '../user/user.module';
import { ResourceModule } from '../resource/resource.module';
import { HistoryModule } from '../history/history.module';
import { User } from '../user/entity/user.entity';
import { Resource } from '../resource/entity/resource.entity';
import { CreateBookingHandler } from './commands/handlers/create-booking.handler';
import { ConfirmBookingHandler } from './commands/handlers/confirm-booking.handler';
import { CancelBookingHandler } from './commands/handlers/cancel-booking.handler';
import { GetBookingByIdHandler } from './queries/handlers/get-booking-by-id.handler';
import { GetBookingsByUserHandler } from './queries/handlers/get-bookings-by-user.handler';
import { GetBookingsByResourceHandler } from './queries/handlers/get-bookings-by-resource.handler';
import { GetAllBookingsHandler } from './queries/handlers/get-all-bookings.handler';
import { GetConfirmedBookingsHandler } from './queries/handlers/get-confirmed-bookings.handler';

const CommandHandlers = [CreateBookingHandler, ConfirmBookingHandler, CancelBookingHandler];
const QueryHandlers = [
  GetBookingByIdHandler,
  GetBookingsByUserHandler,
  GetBookingsByResourceHandler,
  GetAllBookingsHandler,
  GetConfirmedBookingsHandler,
];

@Module({
  imports: [
    TypeOrmModule.forFeature([Booking, User, Resource]),
    CqrsModule,
    UserModule,
    HistoryModule,
    forwardRef(() => ResourceModule),
  ],
  controllers: [BookingController],
  providers: [
    BookingService,
    {
      provide: BOOKING_REPOSITORY,
      useClass: BookingRepository,
    },
    ...CommandHandlers,
    ...QueryHandlers,
  ],
  exports: [BookingService, BOOKING_REPOSITORY],
})
export class BookingModule {}
