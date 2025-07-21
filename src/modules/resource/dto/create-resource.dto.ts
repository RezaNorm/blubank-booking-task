import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateResourceDto {
  @ApiProperty({
    description: 'Room name/number',
    example: 'Room 101',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Room description (optional)',
    example: 'Single bed room with city view',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;
} 