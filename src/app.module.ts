import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './modules/user/user.module';
import { ResourceModule } from './modules/resource/resource.module';
import { BookingModule } from './modules/booking/booking.module';
import { HistoryModule } from './modules/history/history.module';
import { typeOrmModuleOptions } from './database/config/database.config';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmModuleOptions),
    UserModule,
    ResourceModule,
    BookingModule,
    HistoryModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
