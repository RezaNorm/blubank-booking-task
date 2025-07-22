import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './modules/user/user.module';
import { ResourceModule } from './modules/resource/resource.module';
import { BookingModule } from './modules/booking/booking.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USERNAME || 'macbook',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_DATABASE || 'booking',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: process.env.NODE_ENV !== 'production',
    }),
    UserModule,
    ResourceModule,
    BookingModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
