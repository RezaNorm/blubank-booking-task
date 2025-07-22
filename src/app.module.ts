import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './modules/user/user.module';
import { ResourceModule } from './modules/resource/resource.module';
import { BookingModule } from './modules/booking/booking.module';
import { typeOrmModuleOptions } from './database/config/database.config';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmModuleOptions),
    UserModule,
    ResourceModule,
    BookingModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
