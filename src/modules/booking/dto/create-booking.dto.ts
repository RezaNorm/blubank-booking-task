import { IsDateString, IsInt, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBookingDto {
  @ApiProperty({
    description: 'User ID who is making the booking',
    example: 1,
  })
  @IsInt()
  @IsNotEmpty()
  userId: number;

  @ApiProperty({
    description: 'Room ID to be booked',
    example: 1,
  })
  @IsInt()
  @IsNotEmpty()
  resourceId: number;

  @ApiProperty({
    description: 'Booking start time (ISO format)',
    example: '2025-08-22T14:00:00.000Z',
  })
  @IsDateString()
  @IsNotEmpty()
  startTime: string;

  @ApiProperty({
    description: 'Booking end time (ISO format)',
    example: '2025-08-24T16:00:00.000Z',
  })
  @IsDateString()
  @IsNotEmpty()
  endTime: string;
} 