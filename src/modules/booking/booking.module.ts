import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import { Booking } from './entity/booking.entity';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { UserModule } from '../user/user.module';
import { ResourceModule } from '../resource/resource.module';
import { BookingPolicyService } from './policy/booking-policy.service';
import { HistoryModule } from '../history/history.module';
import { CreateBookingHandler } from './commands/create-booking.handler';
import { ConfirmBookingHandler } from './commands/confirm-booking.handler';
import { CancelBookingHandler } from './commands/cancel-booking.handler';
import { GetBookingByIdHandler } from './queries/get-booking-by-id.handler';
import { GetBookingsByUserHandler } from './queries/get-bookings-by-user.handler';
import { GetBookingsByResourceHandler } from './queries/get-bookings-by-resource.handler';
import { GetAllBookingsHandler } from './queries/get-all-bookings.handler';

const CommandHandlers = [CreateBookingHandler, ConfirmBookingHandler, CancelBookingHandler];
const QueryHandlers = [
  GetBookingByIdHandler,
  GetBookingsByUserHandler,
  GetBookingsByResourceHandler,
  GetAllBookingsHandler,
];

@Module({
  imports: [
    TypeOrmModule.forFeature([Booking]),
    forwardRef(() => UserModule),
    forwardRef(() => ResourceModule),
    CqrsModule,
    HistoryModule,
  ],
  providers: [
    BookingService,
    BookingPolicyService,
    { provide: 'IBookingPolicy', useClass: BookingPolicyService },
    ...CommandHandlers,
    ...QueryHandlers,
  ],
  controllers: [BookingController],
  exports: [TypeOrmModule, BookingService],
})
export class BookingModule {} 