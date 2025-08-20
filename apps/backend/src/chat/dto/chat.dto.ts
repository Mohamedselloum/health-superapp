import { ApiProperty } from '@nestjs/swagger';
import { 
  IsString, 
  IsOptional, 
  IsEnum, 
  IsArray, 
  IsNumber, 
  IsBoolean,
  Min,
  Max
} from 'class-validator';

export enum LocaleType {
  EN = 'en',
  FR = 'fr',
  AR = 'ar',
}

export class CreateChatSessionDto {
  @ApiProperty({ enum: LocaleType, example: LocaleType.EN, required: false })
  @IsOptional()
  @IsEnum(LocaleType)
  language?: LocaleType;
}

export class SendMessageDto {
  @ApiProperty({ example: 'I have been experiencing headaches for the past few days...' })
  @IsString()
  content: string;
}

export class SymptomIntakeDto {
  @ApiProperty({ example: 30, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(120)
  age?: number;

  @ApiProperty({ example: 'female', enum: ['male', 'female', 'other', 'prefer_not_to_say'], required: false })
  @IsOptional()
  @IsString()
  sex?: string;

  @ApiProperty({ 
    example: ['headache', 'fatigue', 'mild fever'],
    description: 'List of current symptoms'
  })
  @IsArray()
  @IsString({ each: true })
  symptoms: string[];

  @ApiProperty({ 
    example: '2 days ago',
    description: 'When symptoms started',
    required: false
  })
  @IsOptional()
  @IsString()
  onset?: string;

  @ApiProperty({ 
    example: 5,
    description: 'Severity on scale of 1-10',
    required: false
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(10)
  severity?: number;

  @ApiProperty({ 
    example: ['ibuprofen', 'vitamin D'],
    description: 'Current medications',
    required: false
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  medications?: string[];

  @ApiProperty({ 
    example: ['hypertension', 'diabetes'],
    description: 'Known medical conditions',
    required: false
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  conditions?: string[];

  @ApiProperty({ 
    example: false,
    description: 'Presence of emergency warning signs',
    required: false
  })
  @IsOptional()
  @IsBoolean()
  emergency_signs?: boolean;

  @ApiProperty({ 
    example: 'Symptoms seem to worsen in the evening',
    description: 'Additional notes or context',
    required: false
  })
  @IsOptional()
  @IsString()
  additional_notes?: string;
}

